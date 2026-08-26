import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "#/features/auth/lib/auth-client";
import CreateRoomDialog from "#/features/room/components/CreateRoomDialog";
import RoomsList from "#/features/room/components/RoomsList";
import { roomQueries } from "#/features/room/queries/roomQueries";
import Header from "#/shared/components/layout/header";
import { Spinner } from "#/shared/components/ui/spinner";

export const Route = createFileRoute("/")({
	loader: ({ context }) => {
		context.queryClient.fetchQuery(roomQueries.list());
	},
	component: Home,
});

function Home() {
	const { data: session, isPending: isSessionLoading } =
		authClient.useSession();
	const { data: rooms, isLoading: isRoomsLoading } = useQuery(
		roomQueries.list(),
	);

	return (
		<>
			<Header user={session?.user} userIsLoading={isSessionLoading} />
			<div className="max-w-xl mx-auto p-4 space-y-4">
				<CreateRoomDialog
					isUserLoggedIn={!!session?.user}
					isLoading={isSessionLoading}
				/>

				{isRoomsLoading ? <Spinner /> : <RoomsList rooms={rooms} />}
			</div>
		</>
	);
}
