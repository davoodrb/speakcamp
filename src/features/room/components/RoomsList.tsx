import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";

function RoomsList({ data }) {
	if (!data) return;

	return (
		<section className="space-y-2">
			{data.map((room) => (
				<div key={room.id} className="border rounded p-4 space-y-4">
					<div>
						<div className="flex gap-2 items-center">
							<div>{room.language}</div>
							<div className="bg-muted text-sm p-2 rounded">{room.level}</div>
						</div>
						<div className="text-sm text-muted-foreground">{room.desc}</div>
					</div>
					<Button>
						<Link to="/room/$id" params={{ id: room.id }}>
							Join
						</Link>
					</Button>
				</div>
			))}
		</section>
	);
}

export default RoomsList;
