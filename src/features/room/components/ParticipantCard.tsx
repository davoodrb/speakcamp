import {
  BarVisualizer,
  TrackRefContext,
  useMaybeTrackRefContext,
  useParticipantContext,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { MicOffIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "#/shared/components/ui/avatar";
import { cn } from "#/shared/lib/utils";

function ParticipantCard() {
  const participant = useParticipantContext();

  const audioTracks = useTracks([Track.Source.Microphone]);
  const participantTrack = audioTracks.find(
    (track) => track.participant.identity === participant.identity,
  );

  return (
    <TrackRefContext.Provider value={participantTrack}>
      <ParticipantCardContent />
    </TrackRefContext.Provider>
  );
}

function ParticipantCardContent() {
  const participant = useParticipantContext();
  const trackRef = useMaybeTrackRefContext();

  const displayName = participant.name || participant.identity;
  const isSpeaking = participant.isSpeaking;
  const isMuted = !trackRef || trackRef.publication?.isMuted;

  return (
    <div
      className={cn(
        "relative bg-muted p-4 flex flex-col items-center gap-4 w-xs rounded border",
        isSpeaking && "ring-2 ring-green-500",
      )}
    >
      <div className="absolute left-5 top-5">
        {isMuted && <MicOffIcon className="size-5" />}
      </div>

      <Avatar className="size-32">
        <AvatarFallback>{displayName.slice(0, 3).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>@{displayName}</div>

      <div className="h-12">
        <BarVisualizer barCount={7} className="gap-2!">
          <div className="bg-foreground/80!"></div>
        </BarVisualizer>
      </div>
    </div>
  );
}

export default ParticipantCard;
