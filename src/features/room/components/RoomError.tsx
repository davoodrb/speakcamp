import { type ErrorComponentProps, Link } from "@tanstack/react-router";
import { AlertTriangleIcon, HomeIcon } from "lucide-react";
import { buttonVariants } from "#/shared/components/ui/button";
import { cn } from "#/shared/lib/utils";

function RoomError({ error }: ErrorComponentProps) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Something went wrong while loading this room.";

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <AlertTriangleIcon className="size-16 text-destructive" />
        </div>

        <p className="max-w-md text-xl font-medium text-balance">{message}</p>

        <Link to="/" className={cn(buttonVariants(), "gap-2")}>
          <HomeIcon className="size-4" />
          Browse Rooms
        </Link>
      </div>
    </div>
  );
}

export default RoomError;
