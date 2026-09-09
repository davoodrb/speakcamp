import { createFileRoute } from "@tanstack/react-router";
import { WebhookReceiver } from "livekit-server-sdk";
import { env } from "#/shared/lib/env";
import { prisma } from "#/shared/lib/prisma.server";

const receiver = new WebhookReceiver(
  env.LIVEKIT_API_KEY,
  env.LIVEKIT_API_SECRET,
);

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

        if (event.event === "room_finished" && event.room) {
          await prisma.room.update({
            where: { id: event.room.name },
            data: { deletedAt: new Date() },
          });
        }

        return new Response("OK", { status: 200 });
      },
    },
  },
});
