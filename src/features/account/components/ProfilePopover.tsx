import { useQuery } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { authClient } from "#/features/auth/lib/auth-client";
import ReportUserDialog from "#/features/report/components/ReportUserDialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "#/shared/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/shared/components/ui/popover";
import { Skeleton } from "#/shared/components/ui/skeleton";
import { accountQueries } from "../queries/accountQueries";

type ProfilePopoverProps = {
  userId: string;
  children: ReactNode;
};

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function getJoinLabel(createdAt: Date | string) {
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const monthYear = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
  return `Joined ${monthYear}`;
}

function ProfilePopover({ userId, children }: ProfilePopoverProps) {
  const [open, setOpen] = useState(false);
  const { data: user, isPending } = useQuery(
    accountQueries.publicProfile(userId, open),
  );
  const { data: session } = authClient.useSession();

  const displayName = user?.displayUsername ?? user?.name ?? "";
  const joinLabel = user ? getJoinLabel(user.createdAt) : null;
  const canReport = Boolean(session?.user) && session?.user.id !== user?.id;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full">{children}</PopoverTrigger>

      <PopoverContent className="w-64 p-4" side="top" align="center">
        {isPending ? (
          <div className="flex items-start gap-3">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>
        ) : !user ? (
          <p className="text-sm text-muted-foreground">Profile not available</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Avatar size="lg" className="size-12 shrink-0">
                {user.image ? (
                  <AvatarImage src={user.image} alt={displayName} />
                ) : null}
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  @{user.displayUsername}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {user.bio ?? "No bio yet"}
            </p>

            {joinLabel ? (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarIcon className="size-3.5" />
                {joinLabel}
              </p>
            ) : null}

            {canReport ? (
              <ReportUserDialog
                userId={user.id}
                displayName={user.displayUsername}
              />
            ) : null}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default ProfilePopover;
