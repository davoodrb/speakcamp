import { queryOptions } from "@tanstack/react-query";
import { getRoomById, getRooms } from "../actions/room.functions";
import { roomKeys } from "./roomKeys";

export const roomQueries = {
	list: () =>
		queryOptions({
			queryKey: roomKeys.list(),
			queryFn: async () => {
				const response = await getRooms();
				if (!response.success) {
					throw new Error(response.message);
				}
				return response.data;
			},
		}),

	detail: (roomId: string) =>
		queryOptions({
			queryKey: roomKeys.detail(roomId),
			queryFn: async () => {
				const response = await getRoomById({ data: { id: roomId } });
				if (!response.success) {
					throw new Error(response.message);
				}
				return response.data;
			},
		}),
};
