import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { InfoIcon } from "lucide-react";
import { buttonVariants } from "#/shared/components/ui/button";
import { Skeleton } from "#/shared/components/ui/skeleton";
import ModeToggle from "./ModeToggle";

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
        <Link to="/" className="block max-w-48">
          <Image
            src="/speakcamp-logo-h-d.png"
            layout="fullWidth"
            alt="speakcamp"
            className="hidden dark:block"
          />
          <Image
            src="/speakcamp-logo-h.png"
            layout="fullWidth"
            alt="speakcamp"
            className="dark:hidden"
          />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <ModeToggle />
          <Link
            to="/whats-speakcamp"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            aria-label="What's SpeakCamp?"
          >
            <InfoIcon className="size-4" />
          </Link>
        </div>
        {userIsLoading ? (
          <Skeleton className="w-16 self-stretch" />
        ) : user ? (
          <Link to="/account" className={buttonVariants()}>
            {user.displayUsername.length > 6
              ? `${user.displayUsername.slice(0, 6)}...`
              : user.displayUsername}
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
