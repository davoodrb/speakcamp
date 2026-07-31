import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";

function RoomsList({
	data,
}: {
	data:
		| {
				success: true;
				data: {
					id: string;
					desc: string;
					level: string;
					language: string;
					createdBy: string;
					createdAt: Date;
				}[];
				message: "Rooms retrieved successfully";
				error?: undefined;
		  }
		| {
				success: false;
				error: string;
				data?: undefined;
				message?: undefined;
		  };
}) {
	if (data.error) {
		return "Something went wrong!";
	}

	const { data: rooms } = data;

	if (!rooms) {
		return "No room";
	}

	return (
		<section className="space-y-2">
			{rooms.map((room) => (
				<div key={room.id} className="border rounded p-4 space-y-4">
					<div>
						<div className="flex gap-2">
							<div>{room.language}</div>
							<div>{room.level}</div>
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
