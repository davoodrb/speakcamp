import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import MenuSheet from "./menu-sheet";
import ModeToggle from "./mode-toggle";

function Header({
	user,
	userIsLoading,
}: {
	user?: object;
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
			<div className="flex items-center gap-4">
				<ModeToggle />
				{userIsLoading ? (
					<Skeleton className="w-16 self-stretch" />
				) : user ? (
					<Link to="/auth" className={buttonVariants()}>
						Profile
					</Link>
				) : (
					<Link to="/auth" className={buttonVariants()}>
						Sign in
					</Link>
				)}
				<MenuSheet />
			</div>
		</header>
	);
}

export default Header;
