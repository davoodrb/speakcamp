import { type useChat, useLocalParticipant } from "@livekit/components-react";
import { MessageSquareIcon, SendIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ProfilePopover from "#/features/account/components/ProfilePopover";
import { Avatar, AvatarFallback } from "#/shared/components/ui/avatar";
import { Button } from "#/shared/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/shared/components/ui/empty";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "#/shared/components/ui/sidebar";
import { cn } from "#/shared/lib/utils";

type ChatMessages = ReturnType<typeof useChat>["chatMessages"];
type SendFn = ReturnType<typeof useChat>["send"];

interface RoomChatSidebarProps {
  messages: ChatMessages;
  send: SendFn;
  isSending: boolean;
}

const MAX_MESSAGE_LENGTH = 500;

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RoomChatSidebar({ messages, send, isSending }: RoomChatSidebarProps) {
  const { localParticipant } = useLocalParticipant();
  const { open, openMobile, setOpen, setOpenMobile } = useSidebar();
  const [draft, setDraft] = useState("");
  const [isSubmitSending, setIsSubmitSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, open, openMobile]);

  const handleClose = () => {
    setOpen(false);
    setOpenMobile(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isSending || isSubmitSending) return;
    setIsSubmitSending(true);
    try {
      await send(text);
      setDraft("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message",
      );
    } finally {
      setIsSubmitSending(false);
    }
  };

  const sending = isSending || isSubmitSending;

  return (
    <Sidebar side="right" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-start justify-between gap-2 px-2 pt-2">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">Room chat</p>
            <p className="text-xs text-muted-foreground">
              Messages are live-only and clear on refresh.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleClose}
            aria-label="Close chat"
            title="Close chat"
          >
            <XIcon />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent ref={scrollRef} className="gap-3 p-4">
        {messages.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageSquareIcon />
              </EmptyMedia>
              <EmptyTitle>No messages yet</EmptyTitle>
              <EmptyDescription>Say hello!</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.from?.identity === localParticipant.identity;
            const senderName =
              msg.from?.name || msg.from?.identity || "Unknown";
            return (
              <div
                key={`${msg.timestamp}-${msg.from?.identity}-${msg.message.slice(0, 16)}`}
                className={cn(
                  "flex gap-2",
                  isOwn ? "flex-row-reverse" : "flex-row",
                )}
              >
                {!isOwn && msg.from?.identity && (
                  <ProfilePopover
                    userId={msg.from.identity}
                    triggerClassName="shrink-0"
                  >
                    <Avatar className="size-7 cursor-pointer">
                      <AvatarFallback className="text-xs">
                        {senderName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </ProfilePopover>
                )}
                <div
                  className={cn(
                    "flex max-w-[80%] flex-col gap-1",
                    isOwn ? "items-end" : "items-start",
                  )}
                >
                  <span className="text-xs text-muted-foreground">
                    {isOwn ? "You" : senderName} · {formatTime(msg.timestamp)}
                  </span>
                  <div
                    className={cn(
                      "w-fit rounded-2xl px-3 py-2 text-sm wrap-break-words",
                      isOwn
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-muted text-foreground",
                    )}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <SidebarInput
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Message everyone..."
            maxLength={MAX_MESSAGE_LENGTH}
            aria-label="Chat message"
            disabled={sending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!draft.trim() || sending}
            aria-label="Send message"
            title="Send message"
          >
            <SendIcon />
          </Button>
        </form>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default RoomChatSidebar;
