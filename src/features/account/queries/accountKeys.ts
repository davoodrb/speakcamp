export const accountKeys = {
  all: ["account"] as const,

  publicProfile: (userId: string) =>
    [...accountKeys.all, "public-profile", userId] as const,

  activity: () => [...accountKeys.all, "activity"] as const,
};
