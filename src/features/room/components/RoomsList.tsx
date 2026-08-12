import RoomCard from "./RoomCard";

function RoomsList({ data }) {
	if (!data) return;

	return (
		<section className="space-y-2">
			{data.map((room) => (
				<RoomCard key={room.id} room={room} />
			))}
		</section>
	);
}

export default RoomsList;
