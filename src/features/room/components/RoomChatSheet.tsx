import { type useChat, useLocalParticipant } from "@livekit/components-react";
import { SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ProfilePopover from "#/features/account/components/ProfilePopover";
import { Avatar, AvatarFallback } from "#/shared/components/ui/avatar";
import { Button } from "#/shared/components/ui/button";
import { Input } from "#/shared/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "#/shared/components/ui/sheet";
import { cn } from "#/shared/lib/utils";

type ChatMessages = ReturnType<typeof useChat>["chatMessages"];
type SendFn = ReturnType<typeof useChat>["send"];

interface RoomChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

function RoomChatSheet({
  open,
  onOpenChange,
  messages,
  send,
  isSending,
}: RoomChatSheetProps) {
  const { localParticipant } = useLocalParticipant();
  const [draft, setDraft] = useState("");
  const [isSubmitSending, setIsSubmitSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, open]);

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full flex-col sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Room chat</SheetTitle>
          <SheetDescription>
            Messages are live-only and clear on refresh.
          </SheetDescription>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4">
          {messages.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No messages yet. Say hello!
            </p>
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
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t p-4"
        >
          <Input
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
      </SheetContent>
    </Sheet>
  );
}

export default RoomChatSheet;
