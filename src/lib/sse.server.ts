const channels = new Map<
	string,
	Map<string, ReadableStreamDefaultController>
>();

function getOrCreateChannel(channelName: string) {
	if (!channels.has(channelName)) {
		channels.set(channelName, new Map());
	}
	return channels.get(channelName)!;
}

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

export function broadcastEvent(
	channelName: any,
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
