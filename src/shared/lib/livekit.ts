import { LiveKitAPI } from "livekit-server-sdk";
import { env } from "#/shared/lib/env";

export const liveKitAPI = new LiveKitAPI({
	host: env.VITE_LIVEKIT_URL,
	apiKey: env.LIVEKIT_API_KEY,
	secret: env.LIVEKIT_API_SECRET,
});
