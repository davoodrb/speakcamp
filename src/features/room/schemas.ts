import z from "zod";
import { Language, Level } from "#/generated/prisma/enums";

export const languageValues = Object.values(Language);
export const levelValues = Object.values(Level);

export const createRoomFormSchema = z.object({
	desc: z.string().optional(),
	language: z.enum(languageValues, { error: "Language is required" }),
	level: z.enum(levelValues, { error: "Level is required" }),
});

export type CreateRoomFormValues = z.infer<typeof createRoomFormSchema>;
