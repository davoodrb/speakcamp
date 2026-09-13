import { Link } from "@tanstack/react-router";
import { LockIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/shared/components/ui/dialog";
import { Skeleton } from "#/shared/components/ui/skeleton";
import CreateRoomForm from "./CreateRoomForm";

interface CreateRoomDialogProps {
  isUserLoggedIn: boolean;
  isLoading: boolean;
}

function CreateRoomDialog({
  isUserLoggedIn,
  isLoading,
}: CreateRoomDialogProps) {
  if (isLoading) {
    return <Skeleton className="h-32" />;
  }

  if (!isUserLoggedIn) {
    return (
      <Link
        to="/auth"
        className="group flex w-full flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-border/70 px-4 py-10 text-sm text-muted-foreground transition-colors duration-200 hover:border-border hover:text-foreground"
      >
        <LockIcon className="size-4 opacity-60" />
        <span className="tracking-tight">
          <span className="font-medium text-foreground/80">Sign in</span> to
          create a room
        </span>
      </Link>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className="group flex w-full flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-border/70 px-4 py-10 text-sm">
        <PlusIcon className="size-4 transition-transform duration-200 group-hover:rotate-90" />
        <span className="tracking-tight">Create new room</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Creating a room</DialogTitle>
        </DialogHeader>

        <CreateRoomForm />
      </DialogContent>
    </Dialog>
  );
}

export default CreateRoomDialog;
