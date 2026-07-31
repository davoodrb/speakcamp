import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "#/features/auth/components";

export const Route = createFileRoute("/auth/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SignInForm />;
}
