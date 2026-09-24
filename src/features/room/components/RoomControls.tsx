import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import {
  MessageSquareIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/shared/components/ui/badge";
import { Button } from "#/shared/components/ui/button";

interface RoomControlsProps {
  onOpenChat: () => void;
  unreadCount: number;
}

function RoomControls({ onOpenChat, unreadCount }: RoomControlsProps) {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const room = useRoomContext();
  const [isTogglingMic, setIsTogglingMic] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const isMuted = !isMicrophoneEnabled;

  const handleToggleMic = async () => {
    if (isTogglingMic) return;
    setIsTogglingMic(true);
    try {
      await localParticipant.setMicrophoneEnabled(isMuted);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to toggle microphone",
      );
    } finally {
      setIsTogglingMic(false);
    }
  };

  const handleLeave = async () => {
    if (isLeaving) return;
    setIsLeaving(true);
    try {
      await room.disconnect();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to leave room",
      );
      setIsLeaving(false);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant={isMuted ? "destructive" : "outline"}
        className="rounded-full"
        onClick={handleToggleMic}
        disabled={isTogglingMic}
        aria-pressed={!isMuted}
        aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
        title={isMuted ? "Unmute microphone" : "Mute microphone"}
      >
        Microphone
        {isMuted ? <MicOffIcon /> : <MicIcon />}
      </Button>
      <Button
        variant="outline"
        className="relative rounded-full"
        onClick={onOpenChat}
        aria-label="Open chat"
        title="Open chat"
      >
        Chat
        <MessageSquareIcon />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1 tabular-nums">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>
      <Button
        variant="outline"
        className="rounded-full"
        onClick={handleLeave}
        disabled={isLeaving}
        aria-label="Leave room"
        title="Leave room"
      >
        Leave
        <PhoneOffIcon />
      </Button>
    </div>
  );
}

export default RoomControls;
