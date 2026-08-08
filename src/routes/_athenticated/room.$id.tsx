import { LiveKitRoom } from "@livekit/components-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getRoomToken } from "#/features/room/actions/room.functions";
import { roomQueries } from "#/features/room/queries/roomQueries";
import "@livekit/components-styles";
import RoomContent from "#/features/room/components/RoomContent";
import { env } from "#/lib/env";

export const Route = createFileRoute("/_athenticated/room/$id")({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		context.queryClient.ensureQueryData(roomQueries.detail(params.id));

		const token = getRoomToken({ data: { roomId: params.id } });

		return token;
	},
	pendingComponent: () => <p>Loading</p>,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const token = Route.useLoaderData();

	const { data: room } = useSuspenseQuery(roomQueries.detail(id));

	if (!room) return "404";

	return (
		<LiveKitRoom
			data-lk-theme="default"
			serverUrl={env.VITE_LIVEKIT_URL}
			token={token}
			audio={true}
			video={false}
			className="py-8"
		>
			<RoomContent />
		</LiveKitRoom>
	);
}
