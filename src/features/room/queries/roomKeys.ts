export const roomKeys = {
	all: ["rooms"] as const,

	list: () => [...roomKeys.all, "list"] as const,
	detail: (roomId: string) => [...roomKeys.all, "detail", roomId] as const,
	participantsList: (roomId: string) =>
		[...roomKeys.all, "participantslist", roomId] as const,
};
