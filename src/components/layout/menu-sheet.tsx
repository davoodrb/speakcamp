import { MenuIcon } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet";

function MenuSheet() {
	return (
		<Sheet>
			<SheetTrigger className="flex items-center justify-center">
				<MenuIcon />
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Are you absolutely sure?</SheetTitle>
					<SheetDescription>This action cannot be undone.</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}

export default MenuSheet;
