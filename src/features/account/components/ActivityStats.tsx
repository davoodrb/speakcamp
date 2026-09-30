import { useQuery } from "@tanstack/react-query";
import { ClockIcon, DoorOpenIcon, HistoryIcon } from "lucide-react";
import { Badge } from "#/shared/components/ui/badge";
import { Skeleton } from "#/shared/components/ui/skeleton";
import { formatEnumLabel } from "#/shared/lib/utils";
import { accountQueries } from "../queries/accountQueries";

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}

function formatSessionDate(value: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

const tiles = [
  {
    key: "totalMs",
    label: "Practice time",
    icon: ClockIcon,
  },
  {
    key: "totalSessions",
    label: "Sessions",
    icon: HistoryIcon,
  },
  {
    key: "roomsVisited",
    label: "Rooms visited",
    icon: DoorOpenIcon,
  },
] as const;

function ActivityStats() {
  const { data, isPending } = useQuery(accountQueries.activityStats());

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {["tile-1", "tile-2", "tile-3"].map((key) => (
            <Skeleton key={key} className="h-24" />
          ))}
        </div>
        <div className="space-y-2">
          {["row-1", "row-2", "row-3"].map((key) => (
            <Skeleton key={key} className="h-14" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.totalSessions === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 px-4 py-10 text-center">
        <p className="text-sm font-medium">No activity yet</p>
        <p className="text-sm text-muted-foreground">
          Join a room to start practicing.
        </p>
      </div>
    );
  }

  const values: Record<(typeof tiles)[number]["key"], string> = {
    totalMs: formatDuration(data.totalMs),
    totalSessions: String(data.totalSessions),
    roomsVisited: String(data.roomsVisited),
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((tile) => (
          <div
            key={tile.key}
            className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card p-4"
          >
            <tile.icon className="size-4 text-muted-foreground" />
            <p className="text-xl font-semibold tracking-tight">
              {values[tile.key]}
            </p>
            <p className="text-xs text-muted-foreground">{tile.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <ul className="divide-y divide-border/60">
          {data.recentSessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-sm font-medium">
                  {formatEnumLabel(session.language)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatSessionDate(session.joinedAt)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {session.durationMs !== null ? (
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {formatDuration(session.durationMs)}
                  </span>
                ) : (
                  <Badge variant="secondary">In progress</Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ActivityStats;
