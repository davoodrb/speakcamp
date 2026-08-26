import { LiveKitRoom } from "@livekit/components-react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { getRoomToken } from "#/features/room/actions/room.functions";
import RoomContent from "#/features/room/components/RoomContent";
import RoomNotFound from "#/features/room/components/RoomNotFound";
import { roomQueries } from "#/features/room/queries/roomQueries";
import { Button } from "#/shared/components/ui/button";
import { env } from "#/shared/lib/env";

export const Route = createFileRoute("/_athenticated/room/$id")({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		context.queryClient.ensureQueryData(roomQueries.detail(params.id));
		const token = await getRoomToken({ data: { roomId: params.id } });
		return token;
	},
	pendingComponent: () => <p>Loading</p>,
	notFoundComponent: RoomNotFound,
});

function RouteComponent() {
	const token = Route.useLoaderData();
	const router = useRouter();
	const [permissionState, setPermissionState] = useState<{
		status: "checking" | "granted" | "denied" | "error";
		message?: string;
	}>({ status: "checking" });

	const checkAndRequestPermission = useCallback(async () => {
		setPermissionState({ status: "checking" });

		try {
			const permissionStatus = await navigator.permissions.query({
				name: "microphone" as PermissionName,
			});

			if (permissionStatus.state === "denied") {
				setPermissionState({
					status: "denied",
					message:
						"Microphone access is blocked. Please enable it in your browser settings to connect.",
				});
				return;
			}

			// Request permission
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			stream.getTracks().forEach((track) => {
				track.stop();
			});

			setPermissionState({ status: "granted" });
		} catch (error) {
			if (error instanceof DOMException && error.name === "NotAllowedError") {
				setPermissionState({
					status: "denied",
					message:
						"Microphone access was denied. Please allow microphone access to connect to the room.",
				});
			} else {
				setPermissionState({
					status: "error",
					message:
						"An error occurred while requesting microphone access. Please try again.",
				});
			}
		}
	}, []);

	useEffect(() => {
		checkAndRequestPermission();
	}, [checkAndRequestPermission]);

	if (
		permissionState.status === "denied" ||
		permissionState.status === "error"
	) {
		return (
			<div className="flex flex-col items-center justify-center min-h-100 p-8 text-center">
				<div className="bg-yellow-50 border border-yellow-200 rounded p-6 max-w-md">
					<h3 className="text-lg font-semibold text-yellow-800 mb-2">
						{permissionState.status === "denied"
							? "⚠️ Permission Required"
							: "⚠️ Error"}
					</h3>
					<p className="text-yellow-700 mb-4">{permissionState.message}</p>
					<Button onClick={checkAndRequestPermission} variant="secondary">
						{permissionState.status === "denied"
							? "I've enabled permissions, retry"
							: "Retry"}
					</Button>
				</div>
			</div>
		);
	}

	if (permissionState.status === "checking") {
		return (
			<div className="flex items-center justify-center min-h-100">
				<p className="text-gray-500">Checking permissions...</p>
			</div>
		);
	}

	return (
		<LiveKitRoom
			serverUrl={env.VITE_LIVEKIT_URL}
			token={token}
			onDisconnected={() => {
				router.navigate({
					to: "/",
				});
			}}
			connectOptions={{ autoSubscribe: true }}
			options={{ webAudioMix: false }}
		>
			<RoomContent />
		</LiveKitRoom>
	);
}
