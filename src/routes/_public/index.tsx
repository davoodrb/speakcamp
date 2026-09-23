import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "#/features/auth/lib/auth-client";
import CreateRoomDialog from "#/features/room/components/CreateRoomDialog";
import RoomsList from "#/features/room/components/RoomsList";
import { roomQueries } from "#/features/room/queries/roomQueries";
import { Spinner } from "#/shared/components/ui/spinner";

export const Route = createFileRoute("/_public/")({
  loader: ({ context }) => {
    context.queryClient.query(roomQueries.list());
  },
  component: Home,
});

function Home() {
  const queryClient = useQueryClient();

  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const { data: rooms, isLoading: isRoomsLoading } = useQuery(
    roomQueries.list(),
  );

  useEffect(() => {
    const sse = new EventSource("/api/sse/rooms");

    sse.addEventListener("create", (e) => {
      const room = JSON.parse(e.data);

      queryClient.setQueryData(roomQueries.list().queryKey, (oldRooms) => {
        if (!oldRooms) return [room];

        if (oldRooms.some((existingRoom) => existingRoom.id === room.id)) {
          return oldRooms;
        }

        return [...oldRooms, room];
      });
    });
    sse.addEventListener("delete", (e) => {
      const room = JSON.parse(e.data);

      queryClient.setQueryData(roomQueries.list().queryKey, (oldRooms) => {
        if (!oldRooms) return [];

        return oldRooms.filter((r) => r.id !== room.id);
      });
    });
    sse.addEventListener("participant_joined", (e) => {
      const {
        event: { room, participant },
      } = JSON.parse(e.data);

      queryClient.setQueryData(
        roomQueries.participantsList(room.name).queryKey,
        (oldParticipants) => {
          const current = oldParticipants ?? [];

          if (current.includes(participant.name)) {
            return current;
          }

          return [...current, participant.name];
        },
      );
    });
    sse.addEventListener("participant_left", (e) => {
      const {
        event: { room, participant },
      } = JSON.parse(e.data);

      queryClient.setQueryData(
        roomQueries.participantsList(room.name).queryKey,
        (oldParticipants) => {
          return oldParticipants
            ? oldParticipants.filter((p) => p !== participant.name)
            : [];
        },
      );
    });

    return () => {
      sse.close();
    };
  }, [queryClient]);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <CreateRoomDialog
        isUserLoggedIn={!!session?.user}
        isLoading={isSessionLoading}
      />

      {isRoomsLoading ? <Spinner /> : <RoomsList rooms={rooms} />}
    </div>
  );
}
