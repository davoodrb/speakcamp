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
    <header className="flex items-center justify-between p-4 container mx-auto">
      <div>
        <Link to="/" className="group flex flex-col leading-none max-w-52">
          <img
            src="/speakcamp-logo-h.png"
            alt="speakcamp"
            className="dark:hidden"
          />
          <img
            src="/speakcamp-logo-h-d.png"
            alt="speakcamp"
            className="hidden dark:block"
          />
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <ModeToggle />
          <Link
            to="/contact"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
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
