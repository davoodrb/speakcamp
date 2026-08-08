import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import CreateRoomForm from "./CreateRoomForm";

function CreateRoomDialog() {
	return (
		<Dialog>
			<DialogTrigger render={<Button />}>Create new room</DialogTrigger>
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
