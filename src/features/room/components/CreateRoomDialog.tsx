import { Link } from "@tanstack/react-router";
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
		return <Skeleton className="h-16" />;
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
			<DialogTrigger className="w-full rounded border border-dashed py-8">
				Create new room
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
