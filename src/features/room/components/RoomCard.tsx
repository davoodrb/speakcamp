import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
} from "#/shared/components/ui/avatar";
import { Badge } from "#/shared/components/ui/badge";
import { buttonVariants } from "#/shared/components/ui/button";
import { Skeleton } from "#/shared/components/ui/skeleton";
import { cn } from "#/shared/lib/utils";
import { roomQueries } from "../queries/roomQueries";

function RoomCard({ room }) {
	const { data, isPending } = useQuery(roomQueries.participantsList(room.id));

	const participants = data || [];

	return (
		<div className="border rounded p-4 space-y-4">
			<div>
				<div className="flex gap-2 items-center">
					<div>{room.language}</div>
					<Badge variant="secondary">{room.level}</Badge>
				</div>
				<div className="text-sm text-muted-foreground">{room.desc}</div>
			</div>

			{isPending && (
				<AvatarGroup>
					<Skeleton className="size-16 rounded-full" />
				</AvatarGroup>
			)}

			{!isPending && participants.length > 0 && (
				<div className="flex items-center gap-2">
					<AvatarGroup>
						{participants.map((participant) => (
							<Avatar key={participant} className="size-16">
								<AvatarFallback>{participant.slice(0, 3)}</AvatarFallback>
							</Avatar>
						))}
					</AvatarGroup>
				</div>
			)}

			<Link
				className={cn(
					buttonVariants({ variant: "outline" }),
					"group w-full justify-center gap-1 transition hover:gap-2 hover:border-primary hover:bg-primary/5",
				)}
				to="/room/$id"
				params={{ id: room.id }}
			>
				<span>Join Room</span>
				<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
			</Link>
		</div>
	);
}

export default RoomCard;
