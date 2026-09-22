type ChannelName = "room";

// Keep track of the channels so we can reference them from server functions
// This Map only exists on the server - never bundled to client
const channels = new Map<
  string,
  Map<string, ReadableStreamDefaultController>
>();

function getOrCreateChannel(channelName: string) {
  if (!channels.has(channelName)) {
    channels.set(channelName, new Map());
  }
  return channels.get(channelName);
}

/* ------------------------------ Broadcasting ------------------------------ */

/**
 * Broadcast an event to all connections in a channel.
 *
 * When `eventName` is provided, the SSE message includes an `event:` field,
 * making it a **named event** on the client (`addEventListener(eventName, ...)`).
 * Without `eventName`, the event fires the generic `onmessage` handler.
 *
 * @param channelName - Which channel to broadcast to
 * @param payload - JSON-serializable data to send
 * @param options - Optional: excludeConnectionId, eventName
 *
 * @internal - Only call from server route handlers or server functions
 */
export function broadcastEvent(
  channelName: ChannelName,
  payload: any,
  options?: { excludeConnectionId?: string; eventName?: string },
) {
  const channel = channels.get(channelName);
  if (!channel) {
    throw new Error(`No channel found: ${channelName}`);
  }

  // Build SSE message: optional "event:" line + required "data:" line
  const eventLine = options?.eventName ? `event: ${options.eventName}\n` : "";
  const message = `${eventLine}data: ${JSON.stringify(payload)}\n\n`;
  const encoded = new TextEncoder().encode(message);

  // Send to all connections in this channel
  for (const [connectionId, controller] of channel.entries()) {
    if (
      options?.excludeConnectionId &&
      connectionId === options.excludeConnectionId
    )
      continue;
    try {
      controller.enqueue(encoded);
    } catch (error) {
      console.error(
        `Failed to send to ${connectionId} in ${channelName}:`,
        error,
      );
      channel.delete(connectionId);
    }
  }
}

/**
 * Send an SSE message to a single connection's controller.
 * Supports optional named events via the `eventName` parameter.
 */
export function sendToConnection(
  controller: ReadableStreamDefaultController,
  payload: any,
  eventName?: string,
) {
  const eventLine = eventName ? `event: ${eventName}\n` : "";
  const message = `${eventLine}data: ${JSON.stringify(payload)}\n\n`;
  try {
    controller.enqueue(new TextEncoder().encode(message));
  } catch {
    // Stream already closed (e.g. client disconnected during page load)
  }
}

/* -------------------------- Connection Management ------------------------- */

/**
 * Register an SSE connection to a channel
 * @internal - Only call from server route handlers
 */
export function registerSSEConnection(
  connectionId: string,
  controller: ReadableStreamDefaultController,
  channelName: string = "default",
) {
  const channel = getOrCreateChannel(channelName);
  channel.set(connectionId, controller);
  console.log(`Client connected to ${channelName}: ${connectionId}`, {
    channelTotal: channel.size,
  });
}

export function unregisterSSEConnection(
  connectionId: string,
  channelName: string = "default",
) {
  const channel = channels.get(channelName);
  if (channel) {
    channel.delete(connectionId);
    console.log(`Client disconnected from ${channelName}: ${connectionId}`, {
      remaining: channel.size,
    });
  }
}

export function getSSEConnectionCount(channelName: string = "default"): number {
  return channels.get(channelName)?.size ?? 0;
}
