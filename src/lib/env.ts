import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		BETTER_AUTH_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(1),

		LIVEKIT_API_KEY: z.string().min(1),
		LIVEKIT_API_SECRET: z.string().min(1),
	},

	clientPrefix: "VITE_",
	client: {
		VITE_LIVEKIT_URL: z.string().min(1),
	},

	runtimeEnv: {
		...process.env,
		...import.meta.env,
	},
	emptyStringAsUndefined: true,
});
