import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "#/shared/components/ui/avatar";
import { Badge } from "#/shared/components/ui/badge";
import { buttonVariants } from "#/shared/components/ui/button";
import { Skeleton } from "#/shared/components/ui/skeleton";
import { cn, formatEnumLabel } from "#/shared/lib/utils";
import { roomQueries } from "../queries/roomQueries";

function RoomCard({ room }) {
  const { data, isPending } = useQuery(roomQueries.participantsList(room.id));

  const participants = data || [];
  const hasParticipants = !isPending && participants.length > 0;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-5 rounded-xl border border-border/60 bg-card p-5",
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold tracking-tight">
            {formatEnumLabel(room.language)}
          </h3>
          <Badge
            variant="secondary"
            className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
          >
            {formatEnumLabel(room.level)}
          </Badge>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {room.desc}
        </p>
      </div>

      <div className="min-h-8">
        {isPending && (
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        )}

        {hasParticipants && (
          <div className="flex items-center gap-3">
            <AvatarGroup>
              {participants.map((participant) => (
                <Avatar key={participant} className="size-8 ring-2 ring-card">
                  <AvatarFallback className="text-[10px] font-medium uppercase">
                    {participant.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <span className="text-xs text-muted-foreground">
              {participants.length}{" "}
              {participants.length === 1 ? "member" : "members"}
            </span>
          </div>
        )}

        {!isPending && participants.length === 0 && (
          <span className="text-xs italic text-muted-foreground/70">
            No one here yet
          </span>
        )}
      </div>

      <Link
        to="/room/$id"
        params={{ id: room.id }}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "mt-auto w-full justify-center gap-1.5 rounded-full font-medium",
          "transition-all duration-300",
        )}
      >
        <span>Join Room</span>
        <ArrowUpRightIcon className="size-3.5 transition-transform duration-300" />
      </Link>
    </div>
  );
}

export default RoomCard;
