import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_athenticated/room/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_athenticated/room/$id"!</div>;
}
