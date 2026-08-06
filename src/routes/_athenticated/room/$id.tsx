import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { roomQueries } from "#/features/room/queries/roomQueries";

export const Route = createFileRoute("/_athenticated/room/$id")({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		context.queryClient.ensureQueryData(roomQueries.detail(params.id));
	},
	pendingComponent: () => <p>Loading</p>,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const { data: room } = useSuspenseQuery(roomQueries.detail(id));

	if (!room) return "404";

	return (
		<div>
			{room.language} | {room.level} | {room.desc} | maxUsers:{room.maxUsers}
		</div>
	);
}
