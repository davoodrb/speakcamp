import Redis from "ioredis";

export const redis = new Redis({
	host: process.env.REDIS_HOST || "localhost",
	port: 6379,
	password: process.env.REDIS_PASSWORD,
	retryStrategy: (times) => {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
});

export const ROOM_PARTICIPANTS_KEY = (roomId: string) =>
	`room:${roomId}:participants`;
export const ROOM_KEY = (roomId: string) => `room:${roomId}`;
export const USER_SESSION_KEY = (userId: string) => `user:${userId}:session`;
export const USER_ROOM_KEY = (userId: string) => `user:${userId}:room`;
