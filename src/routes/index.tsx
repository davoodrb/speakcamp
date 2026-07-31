import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import RoomsList from "#/features/room/components/RoomsList";
import { fetchRoomsAction } from "#/features/room/lib/room.functions";

export const Route = createFileRoute("/")({
	component: Home,
	loader: async () => await fetchRoomsAction(),
});

function Home() {
	const rooms = Route.useLoaderData();

	return (
		<div>
			<div className="max-w-md mx-auto mt-16">
				<RoomsList data={rooms} />
			</div>
		</div>
	);
}
