import { createFileRoute } from "@tanstack/react-router";
import Header from "#/components/layout/header";
import { authClient } from "#/features/auth/lib/auth-client";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const { data: session, isPending } = authClient.useSession();

	return <Header user={session?.user} userIsPending={isPending} />;
}
