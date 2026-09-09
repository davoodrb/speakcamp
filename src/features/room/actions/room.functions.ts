import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AccessToken } from "livekit-server-sdk";
import authMiddleware from "#/middlewares/auth";
import { env } from "#/shared/lib/env";
import { liveKitAPI } from "#/shared/lib/livekit";
import { prisma } from "#/shared/lib/prisma.server";
import { createRoomFormSchema } from "../schemas";

export const getRooms = createServerFn({ method: "GET" }).handler(async () => {
  const rooms = await prisma.room.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rooms;
});

export const getRoomById = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const room = await prisma.room.findUnique({
      where: {
        deletedAt: null,
        id: data.id,
      },
    });

    return room;
  });

export const createRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(createRoomFormSchema)
  .handler(async ({ data, context }) => {
    const EMPTY_TIME_OUT = 0.5 * 60;

    const { session } = context;

    const activeRoom = await prisma.room.findFirst({
      where: { createdBy: session.user.id, deletedAt: null },
    });
    if (activeRoom) {
      throw new Error(
        `You already have an active room. Your room must be empty for ${EMPTY_TIME_OUT} seconds to get deleted automatically`,
      );
    }

    const room = await prisma.room.create({
      data: {
        createdBy: session.user.id,
        level: data.level,
        language: data.language,
        desc: data.desc,
      },
    });
    await liveKitAPI.room.createRoom({
      name: room.id,
      emptyTimeout: EMPTY_TIME_OUT,
    });

    return room;
  });

export const deleteRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { session } = context;

    const room = await prisma.room.update({
      where: {
        id: data.id,
        createdBy: session.user.id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return room.id;
  });

export const getRoomToken = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { roomId: string }) => data)
  .handler(async ({ data, context }) => {
    const {
      session: { user },
    } = context;
    const { roomId } = data;

    const room = await prisma.room.findFirst({ where: { id: roomId } });
    if (!room) {
      throw notFound();
    }

    const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
      identity: user.id,
      name: user.displayUsername ?? user.email,
    });
    at.addGrant({ roomJoin: true, room: roomId });

    const token = await at.toJwt();

    return token;
  });

export const getRoomParticipantsLivekit = createServerFn({ method: "GET" })
  .validator((data: { roomId: string }) => data)
  .handler(async ({ data }) => {
    const participants = await liveKitAPI.room.listParticipants(data.roomId);

    const participantNames = participants.map(
      (participant) => participant.name,
    );

    return participantNames;
  });
