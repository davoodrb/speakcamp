import { Link } from "@tanstack/react-router";
import { InfoIcon } from "lucide-react";
import { buttonVariants } from "#/shared/components/ui/button";
import { Skeleton } from "#/shared/components/ui/skeleton";
import ModeToggle from "./mode-toggle";

function Header({
  user,
  userIsLoading,
}: {
  user?: { displayUsername: string };
  userIsLoading?: boolean;
}) {
  return (
    <header className="flex items-center justify-between p-4">
      <div>
        <Link to="/">
          <h1 className="text-bold text-2xl">Rootalk 🗣️</h1>
        </Link>
        <p className="text-xs text-muted-foreground">
          Speak. Connect. Improve.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <ModeToggle />
          <Link
            to="/contact"
            className={buttonVariants({ variant: "outline", size: "icon" })}
            aria-label="Contact"
          >
            <InfoIcon className="size-4" />
          </Link>
        </div>
        {userIsLoading ? (
          <Skeleton className="w-16 self-stretch" />
        ) : user ? (
          <Link to="/account" className={buttonVariants()}>
            {user.displayUsername.slice(0, 12)}
          </Link>
        ) : (
          <Link to="/auth" className={buttonVariants()}>
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
