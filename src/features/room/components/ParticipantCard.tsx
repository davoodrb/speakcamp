import {
  BarVisualizer,
  useLocalParticipant,
  useParticipantContext,
  useParticipantTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  Loader2Icon,
  MicOffIcon,
  VolumeXIcon,
  WifiOffIcon,
} from "lucide-react";
import { useState } from "react";
import ProfilePopover from "#/features/account/components/ProfilePopover";
import { useParticipantConnectionStatus } from "#/features/room/hooks/useParticipantConnectionStatus";
import { Avatar, AvatarFallback } from "#/shared/components/ui/avatar";
import { Badge } from "#/shared/components/ui/badge";
import { cn } from "#/shared/lib/utils";
import ParticipantOptionsPopover from "./ParticipantOptionsPopover";

function ParticipantCard() {
  const participant = useParticipantContext();
  const { localParticipant } = useLocalParticipant();
  const [volume, setVolume] = useState(100);
  const isLocallyMuted = volume === 0;

  const audioTracks = useParticipantTracks(
    [Track.Source.Microphone],
    participant.identity,
  );
  const track = audioTracks[0];

  const connectionStatus = useParticipantConnectionStatus({
    isSubscribed: track?.publication?.isSubscribed ?? false,
    hasPublication: Boolean(track?.publication),
    hasTrack: Boolean(track?.publication?.track),
  });
  const isRemote = participant.identity !== localParticipant.identity;
  // Overlay-only-when-degraded, remotes-only: healthy state renders nothing.
  const showConnectionOverlay = isRemote && connectionStatus !== "connected";

  const isOwner = participant.attributes?.role === "owner";
  const displayName = participant.name || participant.identity;
  const isSpeaking = participant.isSpeaking;
  const isRemotelyMuted =
    !track || track.publication?.isMuted || !track.publication?.track;

  return (
    <div
      className={cn(
        "relative bg-muted p-4 flex flex-col items-center gap-4 w-xs rounded border",
        isSpeaking && "ring-2 ring-green-500",
        showConnectionOverlay && "opacity-90",
      )}
    >
      {showConnectionOverlay && (
        <div className="absolute left-1/2 top-5 -translate-x-1/2">
          <Badge
            variant="outline"
            role="status"
            aria-live="polite"
            className={cn(
              "gap-1.5 tabular-nums",
              connectionStatus === "connecting" &&
                "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400",
              connectionStatus === "reconnecting" &&
                "border-red-500/40 bg-red-500/15 text-red-600 dark:text-red-400",
            )}
          >
            {connectionStatus === "connecting" ? (
              <>
                <Loader2Icon className="size-3.5 animate-spin" aria-hidden />
                Connecting…
              </>
            ) : (
              <>
                <WifiOffIcon className="size-3.5" aria-hidden />
                Reconnecting…
              </>
            )}
          </Badge>
        </div>
      )}
      <div className="absolute left-5 top-5 flex items-center gap-2">
        {isRemotelyMuted && (
          <MicOffIcon className="size-5 text-muted-foreground" />
        )}
        {isLocallyMuted && (
          <VolumeXIcon className="size-5 text-muted-foreground" />
        )}
      </div>

      <div className="absolute right-5 top-5 flex gap-2">
        {isOwner && <Badge className="h-8">Owner</Badge>}
        {isRemote && (
          <ParticipantOptionsPopover volume={volume} setVolume={setVolume} />
        )}
      </div>

      <div className="flex mt-12 w-full">
        <ProfilePopover userId={participant.identity}>
          <div className="w-full border p-2 flex items-center gap-4 justify-center cursor-pointer">
            <Avatar className="size-16 shrink-0">
              <AvatarFallback>
                {displayName.slice(0, 3).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden text-ellipsis">@{displayName}</div>
          </div>
        </ProfilePopover>
      </div>

      <div className="h-12">
        <BarVisualizer track={track} barCount={7} className="gap-2!">
          <div className="bg-foreground/80!"></div>
        </BarVisualizer>
      </div>
    </div>
  );
}

export default ParticipantCard;
