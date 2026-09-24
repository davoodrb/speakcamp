import {
  useParticipantContext,
  useParticipantTracks,
  useRoomContext,
} from "@livekit/components-react";
import { RemoteAudioTrack, Track } from "livekit-client";
import {
  EllipsisVerticalIcon,
  UserXIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/shared/components/ui/popover";
import { removeParticipant } from "../actions/room.functions";

type ParticipantOptionsPopoverProps = {
  isLocallyMuted: boolean;
  setIsLocallyMuted: (muted: boolean) => void;
};

function ParticipantOptionsPopover({
  isLocallyMuted,
  setIsLocallyMuted,
}: ParticipantOptionsPopoverProps) {
  const participant = useParticipantContext();
  const room = useRoomContext();
  const localParticipant = room.localParticipant;
  const [open, setOpen] = useState(false);
  const [isKicking, setIsKicking] = useState(false);

  const audioTracks = useParticipantTracks(
    [Track.Source.Microphone],
    participant.identity,
  );

  const handleToggleLocalMute = () => {
    const next = !isLocallyMuted;
    setIsLocallyMuted(next);

    audioTracks.forEach((track) => {
      const audioTrack = track.publication?.audioTrack;
      if (audioTrack instanceof RemoteAudioTrack) {
        audioTrack.setVolume(next ? 0 : 1);
      }
    });
  };

  const handleKick = async () => {
    if (isKicking) return;

    setIsKicking(true);
    try {
      await removeParticipant({
        data: {
          roomId: room.name,
          identity: participant.identity,
        },
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to kick participant:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsKicking(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger aria-label="Participant Options">
        <EllipsisVerticalIcon className="size-5" />
      </PopoverTrigger>

      <PopoverContent align="end" className="flex gap-1">
        <Button
          onClick={handleToggleLocalMute}
          variant="outline"
          className="w-fit"
          aria-label="Toggle Mute"
        >
          {isLocallyMuted ? (
            <>
              <Volume2Icon className="size-4" />
              Unmute for me
            </>
          ) : (
            <>
              <VolumeXIcon className="size-4" />
              Mute for me
            </>
          )}
        </Button>

        {localParticipant.attributes?.role === "owner" && (
          <Button
            onClick={handleKick}
            disabled={isKicking}
            variant="destructive"
            className="w-fit"
            aria-label="Kick participant"
          >
            <UserXIcon className="size-4" />
            {isKicking ? "Kicking..." : "Kick"}
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default ParticipantOptionsPopover;
