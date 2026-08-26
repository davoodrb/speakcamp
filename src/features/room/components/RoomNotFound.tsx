import { AlertCircleIcon, SearchIcon } from "lucide-react";
import { buttonVariants } from "#/shared/components/ui/button";

function RoomNotFound() {
	return (
		<div className="min-h-[80vh] flex items-center justify-center p-4">
			<div className="max-w-md w-full text-center space-y-8">
				<div className="flex justify-center">
					<AlertCircleIcon className="size-16 text-destructive" />
				</div>

				<div className="space-y-3">
					<h1 className="text-3xl font-bold tracking-tight">Room Not Found</h1>
					<p className="text-muted-foreground text-lg">
						Oops! The room you're looking for doesn't exist or has been removed.
					</p>
				</div>

				<a href="/" className={buttonVariants()}>
					<SearchIcon />
					Browse Rooms
				</a>
			</div>
		</div>
	);
}

export default RoomNotFound;
