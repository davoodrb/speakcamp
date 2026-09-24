import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";

import ProfilePopover from "#/features/account/components/ProfilePopover";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "#/shared/components/ui/avatar";
import { Badge } from "#/shared/components/ui/badge";
import { buttonVariants } from "#/shared/components/ui/button";
import { Skeleton } from "#/shared/components/ui/skeleton";
import { Spinner } from "#/shared/components/ui/spinner";
import { cn, formatEnumLabel } from "#/shared/lib/utils";

import { roomQueries } from "../queries/roomQueries";

function RoomCard({ room }) {
  const { data: participants = [], isPending } = useQuery(
    roomQueries.participantsList(room.id),
  );

  const participantCount = participants.length;
  const hasParticipants = participantCount > 0;
  const canJoin = !isPending && participantCount < room.maxParticipants;

  return (
    <div className="relative flex flex-col gap-5 rounded-xl border border-border/60 bg-card p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold tracking-tight">
            {formatEnumLabel(room.language)}
          </h3>

          <Badge className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
            {formatEnumLabel(room.level)}
          </Badge>

          {isPending ? (
            <Skeleton className="ml-auto h-5 w-10 rounded-full" />
          ) : (
            <Badge className="ml-auto" variant="secondary">
              {participantCount}/{room.maxParticipants}
            </Badge>
          )}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {room.desc}
        </p>
      </div>

      <div className="min-h-8">
        {isPending ? (
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map(() => (
              <Skeleton className="size-8 rounded-full" />
            ))}
          </div>
        ) : hasParticipants ? (
          <div className="flex items-center">
            <AvatarGroup>
              {participants.map((participant) => (
                <ProfilePopover
                  key={participant.identity}
                  userId={participant.identity}
                >
                  <Avatar className="size-8 cursor-pointer ring-2 ring-card">
                    <AvatarFallback className="text-[10px] font-medium uppercase">
                      {participant.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </ProfilePopover>
              ))}
            </AvatarGroup>
          </div>
        ) : (
          <span className="text-xs italic text-muted-foreground/70">
            No one here yet
          </span>
        )}
      </div>

      <Link
        to="/room/$id"
        params={{ id: room.id }}
        disabled={!canJoin}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "mt-auto w-full justify-center gap-1.5 rounded-full font-medium",
          "transition-all duration-300",
          !canJoin && "cursor-not-allowed",
        )}
      >
        {isPending ? (
          <Spinner />
        ) : canJoin ? (
          <>
            <span>Join Room</span>
            <ArrowUpRightIcon className="size-3.5 transition-transform duration-300" />
          </>
        ) : (
          <span>Room is full 🚫</span>
        )}
      </Link>
    </div>
  );
}

export default RoomCard;
