import {
  ParticipantLoop,
  RoomAudioRenderer,
  useChat,
  useLocalParticipant,
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useState } from "react";
import ParticipantCard from "./ParticipantCard";
import RoomChatSheet from "./RoomChatSheet";
import RoomControls from "./RoomControls";
import RoomDetailsHeader from "./RoomDetailsHeader";

interface RoomContentProps {
  room: {
    language: string;
    level: string;
    desc: string | null;
    maxParticipants: number;
  };
}

function RoomContent({ room }: RoomContentProps) {
  const participants = useParticipants();
  const { chatMessages, send, isSending } = useChat();
  const { localParticipant } = useLocalParticipant();
  const [chatOpen, setChatOpen] = useState(false);
  const [lastReadAt, setLastReadAt] = useState(0);

  const unreadCount = chatOpen
    ? 0
    : chatMessages.filter(
        (msg) =>
          msg.timestamp > lastReadAt &&
          msg.from?.identity !== localParticipant.identity,
      ).length;

  const handleOpenChat = () => {
    setChatOpen(true);
    const latest = chatMessages[chatMessages.length - 1];
    if (latest) {
      setLastReadAt(latest.timestamp);
    }
  };

  const handleChatOpenChange = (open: boolean) => {
    setChatOpen(open);
    if (open) {
      const latest = chatMessages[chatMessages.length - 1];
      if (latest) {
        setLastReadAt(latest.timestamp);
      }
    }
  };

  return (
    <div className="space-y-4">
      <RoomDetailsHeader
        language={room.language}
        level={room.level}
        desc={room.desc}
        liveCount={participants.length}
        maxParticipants={room.maxParticipants}
      />
      <RoomControls onOpenChat={handleOpenChat} unreadCount={unreadCount} />

      <div className="container mx-auto flex flex-wrap gap-4 items-stretch justify-center">
        <ParticipantLoop participants={participants}>
          <ParticipantCard />
        </ParticipantLoop>
      </div>

      <RoomChatSheet
        open={chatOpen}
        onOpenChange={handleChatOpenChange}
        messages={chatMessages}
        send={send}
        isSending={isSending}
      />

      <RoomAudioRenderer />
    </div>
  );
}

export default RoomContent;
