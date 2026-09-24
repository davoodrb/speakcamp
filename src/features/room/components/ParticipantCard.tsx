import {
  BarVisualizer,
  useLocalParticipant,
  useParticipantContext,
  useParticipantTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { MicOffIcon, VolumeXIcon } from "lucide-react";
import { useState } from "react";
import ProfilePopover from "#/features/account/components/ProfilePopover";
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
      )}
    >
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
        {participant.identity !== localParticipant.identity && (
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
