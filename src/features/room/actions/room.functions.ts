import { createServerFn } from "@tanstack/react-start";
import { AccessToken } from "livekit-server-sdk";
import { env } from "#/lib/env";
import { liveKitAPI } from "#/lib/livekit";
import { prisma } from "#/lib/prisma.server";
import authMiddleware from "#/middlewares/auth";
import { createRoomFormSchema } from "../schemas";

export const getRooms = createServerFn({ method: "GET" }).handler(async () => {
	const rooms = await prisma.room.findMany({
		where: {
			deletedAt: null,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return {
		success: true,
		data: rooms,
		message: "Rooms retrieved successfully",
	};
});

export const getRoomById = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		const room = await prisma.room.findUnique({
			where: {
				deletedAt: null,
				id: data.id,
			},
		});

		return {
			success: true,
			data: room,
			message: "Room retrieved successfully",
		};
	});

export const createRoom = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(createRoomFormSchema)
	.handler(async ({ data, context }) => {
		const EMPTY_TIME_OUT = 0.5 * 60;

		const { session } = context;

		const activeRoom = await prisma.room.findFirst({
			where: { createdBy: session.user.id, deletedAt: null },
		});

		if (activeRoom) {
			return {
				success: false,
				message: `You already have an active room. Your room must be empty for ${EMPTY_TIME_OUT} to get deleted automatically`,
			};
		}

		const room = await prisma.room.create({
			data: {
				createdBy: session.user.id,
				level: data.level,
				language: data.language,
				desc: data.desc,
			},
		});

		await liveKitAPI.room.createRoom({
			name: room.id,
			emptyTimeout: EMPTY_TIME_OUT,
			// maxParticipants: 6,
		});

		return {
			success: true,
			data: room,
			message: "Room created successfully",
		};
	});

export const deleteRoom = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: { id: string }) => data)
	.handler(async ({ data, context }) => {
		const { session } = context;

		await prisma.room.update({
			where: {
				id: data.id,
				createdBy: session.user.id,
				deletedAt: null,
			},
			data: {
				deletedAt: new Date(),
			},
		});

		return {
			success: true,
			message: "Room deleted successfully",
		};
	});

export const getRoomToken = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: { roomId: string }) => data)
	.handler(async ({ data, context }) => {
		const {
			session: { user },
		} = context;
		const { roomId } = data;

		const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
			identity: user.id,
			name: user.displayUsername ?? user.email,
		});
		at.addGrant({ roomJoin: true, room: roomId });

		const token = await at.toJwt();

		return token;
	});
