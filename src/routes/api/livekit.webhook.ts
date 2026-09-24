import { createFileRoute } from "@tanstack/react-router";
import { WebhookReceiver } from "livekit-server-sdk";
import { env } from "#/shared/lib/env";
import { prisma } from "#/shared/lib/prisma.server";
import { broadcastEvent } from "#/shared/lib/sse.server";

const REJOIN_THRESHOLD_MS = 10 * 1000;

const receiver = new WebhookReceiver(
  env.LIVEKIT_API_KEY,
  env.LIVEKIT_API_SECRET,
);

function getJoinTime(joinedAtMs?: bigint): Date {
  if (joinedAtMs && joinedAtMs > 0) {
    return new Date(Number(joinedAtMs));
  }
  return new Date();
}

async function resolveUserId(identity: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: identity },
    select: { id: true },
  });
  return user?.id ?? null;
}

async function trackParticipantJoined(
  roomId: string,
  identity: string,
  joinedAtMs?: bigint,
) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true },
  });
  if (!room) {
    console.warn(`Skipping room session: unknown room ${roomId}`);
    return;
  }

  const userId = await resolveUserId(identity);
  const joinTime = getJoinTime(joinedAtMs);

  const openSession = await prisma.roomSession.findFirst({
    where: { roomId, userId, leftAt: null },
    orderBy: { joinedAt: "desc" },
  });

  if (openSession) {
    const isDuplicateDelivery =
      Math.abs(openSession.joinedAt.getTime() - joinTime.getTime()) <=
      REJOIN_THRESHOLD_MS;
    if (isDuplicateDelivery) {
      return;
    }
    await prisma.roomSession.update({
      where: { id: openSession.id },
      data: { leftAt: joinTime },
    });
  }

  await prisma.roomSession.create({
    data: { roomId, userId, joinedAt: joinTime },
  });
}

async function trackParticipantLeft(roomId: string, identity: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true },
  });
  if (!room) {
    console.warn(`Skipping room session: unknown room ${roomId}`);
    return;
  }

  const userId = await resolveUserId(identity);
  const leaveTime = new Date();

  const openSession = await prisma.roomSession.findFirst({
    where: { roomId, userId, leftAt: null },
    orderBy: { joinedAt: "desc" },
  });

  if (openSession) {
    await prisma.roomSession.update({
      where: { id: openSession.id },
      data: { leftAt: leaveTime },
    });
    return;
  }

  await prisma.roomSession.create({
    data: { roomId, userId, joinedAt: leaveTime, leftAt: leaveTime },
  });
}

async function closeRoomSessions(roomId: string) {
  await prisma.roomSession.updateMany({
    where: { roomId, leftAt: null },
    data: { leftAt: new Date() },
  });
}

export const Route = createFileRoute("/api/livekit/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();

        const authorization = request.headers.get("authorization");

        if (!authorization) {
          return;
        }

        const event = await receiver.receive(body, authorization);

        try {
          if (event.event === "room_finished" && event.room) {
            const room = await prisma.room.update({
              where: { id: event.room.name },
              data: { deletedAt: new Date() },
            });
            await closeRoomSessions(event.room.name);
            broadcastEvent("room", room, {
              eventName: "delete",
            });
          }
          if (
            event.event === "participant_joined" &&
            event.room &&
            event.participant
          ) {
            await trackParticipantJoined(
              event.room.name,
              event.participant.identity,
              event.participant.joinedAtMs,
            );
            broadcastEvent(
              "room",
              { event },
              {
                eventName: "participant_joined",
              },
            );
          }
          if (
            (event.event === "participant_left" ||
              event.event === "participant_connection_aborted") &&
            event.room &&
            event.participant
          ) {
            await trackParticipantLeft(
              event.room.name,
              event.participant.identity,
            );
            broadcastEvent(
              "room",
              { event },
              {
                eventName: "participant_left",
              },
            );
          }
        } catch (error) {
          console.error("Failed to track room session:", error);
        }

        return new Response("OK", { status: 200 });
      },
    },
  },
});
