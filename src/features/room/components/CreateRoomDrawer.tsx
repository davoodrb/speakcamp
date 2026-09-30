import { Link } from "@tanstack/react-router";
import { LockIcon, PlusIcon } from "lucide-react";
import { Button } from "#/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "#/shared/components/ui/drawer";
import { Skeleton } from "#/shared/components/ui/skeleton";
import { useIsMobile } from "#/shared/hooks/use-mobile";
import CreateRoomForm from "./CreateRoomForm";

interface CreateRoomDrawerProps {
  isUserLoggedIn: boolean;
  isLoading: boolean;
}

function CreateRoomDrawer({
  isUserLoggedIn,
  isLoading,
}: CreateRoomDrawerProps) {
  const isMobile = useIsMobile();
  const formId = "create-room-form";

  if (isLoading) {
    return <Skeleton className="h-32" />;
  }

  if (!isUserLoggedIn) {
    return (
      <Link
        to="/auth"
        className="bg-muted group flex w-full flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-border/70 px-4 py-10 text-sm text-muted-foreground transition-colors duration-200 hover:border-border hover:text-foreground"
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
    <Drawer
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger
        render={
          <button
            type="button"
            className="bg-muted group flex w-full flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-border/70 px-4 py-10 text-sm"
          />
        }
      >
        <PlusIcon className="size-4" />
        <span className="tracking-tight">Create new room</span>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Creating a room</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <CreateRoomForm formId={formId} showSubmitButton={false} />
        </div>

        <DrawerFooter>
          <Button type="submit" form={formId}>
            Create Room
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateRoomDrawer;
