import { Link } from "@tanstack/react-router";
import { Badge } from "#/shared/components/ui/badge";
import { buttonVariants } from "#/shared/components/ui/button";

function RoomsList({ data }) {
	if (!data) return;

	return (
		<section className="space-y-2">
			{data.map((room) => (
				<div key={room.id} className="border rounded p-4 space-y-4">
					<div>
						<div className="flex gap-2 items-center">
							<div className="lowercase first-letter:uppercase">
								{room.language}
							</div>
							<Badge variant="secondary">{room.level}</Badge>
						</div>
						<div className="text-sm text-muted-foreground">{room.desc}</div>
					</div>
					<Link
						className={buttonVariants()}
						to="/room/$id"
						params={{ id: room.id }}
					>
						join
					</Link>
				</div>
			))}
		</section>
	);
}

export default RoomsList;
