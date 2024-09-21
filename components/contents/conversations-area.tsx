"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useMediaQuery } from "usehooks-ts";
import { MessageSquareText } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useChatStore } from "@/stores/use-chat-store";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import SendMessageForm from "@/components/forms/send-message-form";
import ConversationMessage from "@/components/contents/conversation-message";

type ConversationAreaProps = {
  currentUser: Doc<"users">;
};

export default function ConversationsArea({
  currentUser,
}: ConversationAreaProps) {
  const { activeConversation } = useChatStore();
  const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);
  const [navbarHeight, setNavbarHeight] = useState<number>(0);
  const [conversationUserHeight, setConversationUserHeight] = useState(0);
  const sendMessageFormContainerRef = useRef<HTMLDivElement>(null);
  const scrollAreaContentRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const matchesMdMediaQuery = useMediaQuery("(min-width: 768px)");
  const markMessagesAsSeen = useMutation(api.messages.markMessagesAsSeen);
  const messages = useQuery(api.messages.getMessages, {
    conversationId: activeConversation?._id,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);

      const navbar = document.getElementById("dashboard-navbar");

      if (currentUser && activeConversation) {
        const otherUser = activeConversation.users.find(
          (user) => user?._id !== currentUser._id,
        );

        if (otherUser) {
          const conversationUser = document.getElementById(
            `conversation-${otherUser._id}`,
          );

          if (conversationUser) {
            const computedStyle = window.getComputedStyle(conversationUser);

            setConversationUserHeight(parseFloat(computedStyle.height));
          }
        }
      }

      if (navbar) {
        const computedStyle = window.getComputedStyle(navbar);

        setNavbarHeight(parseFloat(computedStyle.height));
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeConversation, currentUser]);

  useEffect(() => {
    hasScrolledRef.current = false;
  }, [activeConversation]);

  useEffect(() => {
    if (messages && scrollAreaContentRef.current && !hasScrolledRef.current) {
      scrollAreaContentRef.current.scrollIntoView(false);

      hasScrolledRef.current = true;
    }
  }, [messages]);

  const handleMarkMessagesAsSeen = useCallback(
    async (userId: Id<"users">) => {
      if (messages) {
        const unseenMessageIds = messages
          .filter((message) => !message.seenByIds.includes(userId))
          .map((message) => message._id);

        if (unseenMessageIds.length > 0) {
          await markMessagesAsSeen({ messageIds: unseenMessageIds });
        }
      }
    },
    [markMessagesAsSeen, messages],
  );

  useEffect(() => {
    handleMarkMessagesAsSeen(currentUser._id);
  }, [currentUser, handleMarkMessagesAsSeen]);

  function determineSenderChange(index: number) {
    if (!messages) {
      return false;
    }

    if (index === 0) {
      return true;
    }

    return messages[index].senderId !== messages[index - 1].senderId;
  }

  return (
    <div
      className="flex h-full w-full flex-col gap-y-4 md:bg-muted/30"
      style={{
        height: matchesMdMediaQuery
          ? `calc(${screenHeight}px - ${navbarHeight}px)`
          : `calc(${screenHeight}px - ${navbarHeight}px - ${conversationUserHeight}px - 48px)`,
      }}
    >
      {activeConversation && (
        <>
          <div
            className="flex flex-1 items-center justify-center rounded-md bg-muted/30 py-4 md:rounded-none md:bg-transparent md:pb-0"
            style={{
              height: matchesMdMediaQuery
                ? `calc(${screenHeight}px - ${navbarHeight}px - ${sendMessageFormContainerRef.current?.clientHeight || 0}px - 32px)`
                : `calc(${screenHeight}px - ${navbarHeight}px - ${conversationUserHeight}px - ${sendMessageFormContainerRef.current?.clientHeight || 0}px - 64px)`,
            }}
          >
            {messages ? (
              messages.length > 0 ? (
                <ScrollArea
                  className="h-full w-full px-4"
                  styleNameViewport={{
                    maxHeight: matchesMdMediaQuery
                      ? `calc(${screenHeight}px - ${navbarHeight}px - ${sendMessageFormContainerRef.current?.clientHeight || 0}px - 32px)`
                      : `calc(${screenHeight}px - ${navbarHeight}px - ${conversationUserHeight}px - ${sendMessageFormContainerRef.current?.clientHeight || 0}px - 96px)`,
                  }}
                >
                  <div
                    className="flex flex-col gap-y-3.5"
                    ref={scrollAreaContentRef}
                  >
                    {messages.map((message, index) => (
                      <ConversationMessage
                        key={`message-${message._id}`}
                        currentUser={currentUser}
                        message={message}
                        isFirstMessageOfParticipant={determineSenderChange(
                          index,
                        )}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 px-4 text-center text-muted-foreground md:flex-row">
                  <MessageSquareText className="h-5 w-5 shrink-0" />
                  <p>No messages exchanged.</p>
                </div>
              )
            ) : (
              <Spinner type="circular" size="sm" />
            )}
          </div>
          <div
            className="px-0 md:px-4 md:pb-4"
            ref={sendMessageFormContainerRef}
          >
            <div className="rounded-md border bg-background py-3">
              <SendMessageForm conversation={activeConversation} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
