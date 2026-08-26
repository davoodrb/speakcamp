import RoomCard from "./RoomCard";
import RoomsListEmpty from "./RoomsListEmpty";

function RoomsList({ rooms }) {
	if (rooms && rooms.length === 0) {
		return <RoomsListEmpty />;
	}

	return (
		<section className="space-y-2">
			{rooms.map((room) => (
				<RoomCard key={room.id} room={room} />
			))}
		</section>
	);
}

export default RoomsList;
