import { createFileRoute } from "@tanstack/react-router";
import {
  registerSSEConnection,
  sendToConnection,
  unregisterSSEConnection,
} from "#/shared/lib/sse.server";

export const Route = createFileRoute("/api/sse/rooms")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const connectionId = crypto.randomUUID();

        const stream = new ReadableStream({
          start(controller) {
            registerSSEConnection(connectionId, controller, "room");

            sendToConnection(controller, {
              message: "Connected to channel",
            });

            request.signal?.addEventListener("abort", () => {
              unregisterSSEConnection(connectionId, "room");
            });
          },
        });

        return new Response(stream, {
          headers: {
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Content-Type": "text/event-stream",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
