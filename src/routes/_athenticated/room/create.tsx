import { createFileRoute } from "@tanstack/react-router";
import CreateRoomForm from "#/features/room/components/CreateRoomForm";

export const Route = createFileRoute("/_athenticated/room/create")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mt-8 p-4 max-w-md mx-auto">
			<CreateRoomForm />
		</div>
	);
}
