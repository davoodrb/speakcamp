import {
  useParticipantContext,
  useRoomContext,
} from "@livekit/components-react";
import { RemoteParticipant } from "livekit-client";
import {
  EllipsisVerticalIcon,
  UserXIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "#/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/shared/components/ui/popover";
import { Slider } from "#/shared/components/ui/slider";
import { removeParticipant } from "../actions/room.functions";

const DEFAULT_VOLUME = 100;

type ParticipantOptionsPopoverProps = {
  volume: number;
  setVolume: (volume: number) => void;
};

function ParticipantOptionsPopover({
  volume,
  setVolume,
}: ParticipantOptionsPopoverProps) {
  const participant = useParticipantContext();
  const room = useRoomContext();
  const localParticipant = room.localParticipant;
  const [open, setOpen] = useState(false);
  const [isKicking, setIsKicking] = useState(false);
  const lastNonZeroVolume = useRef(DEFAULT_VOLUME);

  const applyVolume = (value: number) => {
    if (participant instanceof RemoteParticipant) {
      participant.setVolume(value / 100);
    }
  };

  const handleVolumeChange = (next: number | readonly number[]) => {
    const value = (Array.isArray(next) ? next[0] : next) ?? DEFAULT_VOLUME;
    if (value > 0) {
      lastNonZeroVolume.current = value;
    }
    setVolume(value);
    applyVolume(value);
  };

  const handleToggleMute = () => {
    const value = volume === 0 ? lastNonZeroVolume.current : 0;
    setVolume(value);
    applyVolume(value);
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

  const VolumeIcon =
    volume === 0 ? VolumeXIcon : volume < 50 ? Volume1Icon : Volume2Icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger aria-label="Participant Options">
        <EllipsisVerticalIcon className="size-5" />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-56 flex-col gap-3">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleToggleMute}
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            aria-label={
              volume === 0 ? "Unmute participant" : "Mute participant"
            }
          >
            <VolumeIcon className="size-4" />
          </Button>

          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            min={0}
            max={100}
            step={1}
            aria-label="Participant volume"
            className="flex-1"
          />

          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
            {volume}%
          </span>
        </div>

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
