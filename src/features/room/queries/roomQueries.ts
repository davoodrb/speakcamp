import { queryOptions } from "@tanstack/react-query";
import {
	getRoomById,
	getRoomParticipantsLivekit,
	getRooms,
} from "../actions/room.functions";
import { roomKeys } from "./roomKeys";

export const roomQueries = {
	list: () =>
		queryOptions({
			queryKey: roomKeys.list(),
			queryFn: async () => {
				return await getRooms();
			},
		}),

	detail: (roomId: string) =>
		queryOptions({
			queryKey: roomKeys.detail(roomId),
			queryFn: async () => {
				return await getRoomById({ data: { id: roomId } });
			},
		}),

	participantsList: (roomId: string) =>
		queryOptions({
			queryKey: roomKeys.participantsList(roomId),
			queryFn: async () => {
				return await getRoomParticipantsLivekit({
					data: { roomId: roomId },
				});
			},
		}),
};
