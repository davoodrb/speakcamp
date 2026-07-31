import { createServerFn } from "@tanstack/react-start";
import { getSession } from "#/features/auth/lib/auth.functions";
import { prisma } from "#/lib/prisma.server";
import { createRoomFormSchema } from "../schemas";

export const fetchRoomsAction = createServerFn({ method: "GET" }).handler(
	async () => {
		try {
			const rooms = await prisma.room.findMany({
				orderBy: {
					createdAt: "desc",
				},
			});

			return {
				success: true,
				data: rooms,
				message: "Rooms retrieved successfully",
			};
		} catch (error) {
			console.error("Error fetching room:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to fetch rooms",
			};
		}
	},
);

export const createRoomAction = createServerFn({ method: "POST" })
	.validator(createRoomFormSchema)
	.handler(async ({ data }) => {
		try {
			const session = await getSession();

			if (!session?.session) {
				throw new Error();
			}

			const room = await prisma.room.create({
				data: {
					createdBy: session.user.id,
					level: data.level,
					language: data.language,
					desc: data.desc,
				},
			});

			return {
				success: true,
				data: room,
				message: "Room created successfully",
			};
		} catch (error) {
			console.error("Error creating room:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to create room",
			};
		}
	});
