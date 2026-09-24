import { queryOptions } from "@tanstack/react-query";
import { getPublicProfile } from "../actions/account.functions";
import { getActivityStats } from "../actions/stats.functions";
import { accountKeys } from "./accountKeys";

export const accountQueries = {
  publicProfile: (userId: string, enabled = true) =>
    queryOptions({
      queryKey: accountKeys.publicProfile(userId),
      queryFn: async () => {
        return await getPublicProfile({ data: { userId } });
      },
      enabled: enabled && Boolean(userId),
      staleTime: 60 * 1000,
    }),

  activityStats: () =>
    queryOptions({
      queryKey: accountKeys.activity(),
      queryFn: async () => {
        return await getActivityStats();
      },
      staleTime: 60 * 1000,
    }),
};
