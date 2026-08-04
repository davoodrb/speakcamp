import type { Language, Level } from "#/generated/prisma/enums";

export type Rooms = Room[];
export interface Room {
	id: string;
	desc?: string;
	language: Language;
	level: Level;
	createdBy: string;
	createdAt: Date;
}
