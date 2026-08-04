import z from "zod";
import { Language, Level } from "#/generated/prisma/enums";

export const createRoomFormSchema = z.object({
	level: z.enum(Level),
	language: z.enum(Language),
	desc: z.string().optional(),
});

export type CreateRoomForm = z.infer<typeof createRoomFormSchema>;
