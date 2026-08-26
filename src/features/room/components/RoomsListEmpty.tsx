import { SquareDashedIcon } from "lucide-react";

function RoomsListEmpty() {
	return (
		<div className="flex items-center justify-center p-4">
			<div className="max-w-md w-full text-center space-y-2">
				<div className="flex justify-center">
					<SquareDashedIcon className="size-8" />
				</div>

				<div className="space-y-1">
					<h1 className="text-xl font-bold tracking-tight">
						No Rooms Available
					</h1>
					<p className="text-muted-foreground text-base">
						There are no rooms yet. You can create one to get started!
					</p>
				</div>
			</div>
		</div>
	);
}

export default RoomsListEmpty;
