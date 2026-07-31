export type Rooms = Room[];

export interface Room {
	id: string;
	title: string;
	language: string;
	createdBy: string;
	createdAt: Date;
}
