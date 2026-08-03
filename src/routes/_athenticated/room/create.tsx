import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_athenticated/room/create")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_athenticated/room/create"!</div>;
}
