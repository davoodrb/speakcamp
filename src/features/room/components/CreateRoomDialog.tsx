import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
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
				className="block rounded border border-dashed py-8 text-center"
			>
				Join to create room
			</Link>
		);
	}

	return (
		<Dialog>
			<DialogTrigger className="w-full rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 px-4 py-8 text-center text-sm font-medium text-muted-foreground hover:bg-muted transition">
				<div className="flex flex-col items-center gap-2">
					<PlusIcon />
					<span>Create new room</span>
				</div>
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
