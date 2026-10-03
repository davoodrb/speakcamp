import {
  ParticipantLoop,
  RoomAudioRenderer,
  useChat,
  useLocalParticipant,
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { type CSSProperties, useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "#/shared/components/ui/sidebar";
import ParticipantCard from "./ParticipantCard";
import RoomChatSidebar from "./RoomChatSidebar";
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
  return (
    <>
      <SidebarProvider
        defaultOpen={false}
        style={{ "--sidebar-width": "24rem" } as CSSProperties}
        className="min-h-0"
      >
        <RoomContentInner room={room} />
      </SidebarProvider>

      <RoomAudioRenderer />
    </>
  );
}

function RoomContentInner({ room }: RoomContentProps) {
  const participants = useParticipants();
  const { chatMessages, send, isSending } = useChat();
  const { localParticipant } = useLocalParticipant();
  const { isMobile, open, openMobile, setOpen, setOpenMobile } = useSidebar();
  const [lastReadAt, setLastReadAt] = useState(0);

  // The sidebar keeps separate state for desktop (open) and mobile
  // (openMobile, rendered as a Sheet overlay). Read the one that applies.
  const chatVisible = isMobile ? openMobile : open;

  const unreadCount = chatVisible
    ? 0
    : chatMessages.filter(
        (msg) =>
          msg.timestamp > lastReadAt &&
          msg.from?.identity !== localParticipant.identity,
      ).length;

  const handleOpenChat = () => {
    setOpen(true);
    setOpenMobile(true);
    const latest = chatMessages[chatMessages.length - 1];
    if (latest) {
      setLastReadAt(latest.timestamp);
    }
  };

  return (
    <>
      <SidebarInset className="gap-4">
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
      </SidebarInset>

      <RoomChatSidebar
        messages={chatMessages}
        send={send}
        isSending={isSending}
      />
    </>
  );
}

export default RoomContent;
