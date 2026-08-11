import { LiveKitRoom } from "@livekit/components-react";
import { createFileRoute, useRouter } from "@tanstack/react-router"; // Import this
import { getRoomToken } from "#/features/room/actions/room.functions";
import RoomContent from "#/features/room/components/RoomContent";
import { roomQueries } from "#/features/room/queries/roomQueries";
import { env } from "#/shared/lib/env";

export const Route = createFileRoute("/_athenticated/room/$id")({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		context.queryClient.ensureQueryData(roomQueries.detail(params.id));

		const token = await getRoomToken({ data: { roomId: params.id } });

		return token;
	},
	pendingComponent: () => <p>Loading</p>,
});

function RouteComponent() {
	const token = Route.useLoaderData();
	const router = useRouter();

	return (
		<LiveKitRoom
			serverUrl={env.VITE_LIVEKIT_URL}
			token={token}
			onDisconnected={() => {
				router.navigate({
					to: "/",
				});
			}}
		>
			<RoomContent />
		</LiveKitRoom>
	);
}
