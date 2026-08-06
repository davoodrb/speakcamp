import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Header from "#/components/layout/header";
import { Spinner } from "#/components/ui/spinner";
import { authClient } from "#/features/auth/lib/auth-client";
import RoomsList from "#/features/room/components/RoomsList";
import { roomQueries } from "#/features/room/queries/roomQueries";

export const Route = createFileRoute("/")({
	loader: ({ context }) => {
		context.queryClient.fetchQuery(roomQueries.list());
	},
	component: Home,
});

function Home() {
	const { data: session, isPending } = authClient.useSession();
	const { data: rooms, isLoading } = useQuery(roomQueries.list());

	return (
		<>
			<Header user={session?.user} userIsPending={isPending} />
			<div className="max-w-xl mx-auto p-4">
				{isLoading ? (
					<Spinner className="mx-auto" />
				) : (
					<RoomsList data={rooms} />
				)}
			</div>
		</>
	);
}
