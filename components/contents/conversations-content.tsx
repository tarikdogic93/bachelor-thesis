"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { useMediaQuery } from "usehooks-ts";
import { MessageSquare } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useChatStore } from "@/stores/use-chat-store";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationUser from "@/components/contents/conversation-user";
import ConversationsArea from "@/components/contents/conversations-area";

export default function ConversationsContent() {
  const { activeConversation } = useChatStore();
  const scrollAreaContentRef = useRef<HTMLDivElement>(null);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const matchesMdMediaQuery = useMediaQuery("(min-width: 768px)");
  const currentUser = useQuery(api.users.currentUser);
  const conversations = useQuery(api.conversations.getConversations, {
    type: "one-on-one",
  });
  const presenceInRoom = useQuery(api.presence.getPresenceInRoom, {
    room: "dashboard",
  });

  const conversationsToDisplay = useMemo(() => {
    return activeConversation && !matchesMdMediaQuery
      ? [activeConversation]
      : conversations;
  }, [activeConversation, conversations, matchesMdMediaQuery]);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);

      const navbar = document.getElementById("dashboard-navbar");

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
    if (
      conversationsToDisplay &&
      activeConversation &&
      scrollAreaContentRef.current
    ) {
      const conversationElements = scrollAreaContentRef.current.children;

      const index = conversationsToDisplay.findIndex(
        (conversation) => conversation._id === activeConversation._id,
      );

      if (index !== -1) {
        conversationElements[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeConversation, conversationsToDisplay]);

  const userPresenceMap = useMemo(() => {
    const presenceMap = new Map<
      string,
      {
        showOnlinePresence: boolean;
        doNotDisturb: boolean;
        isUserOnline: boolean;
      }
    >();

    if (presenceInRoom) {
      presenceInRoom.forEach((presence) =>
        presenceMap.set(presence.userId, {
          isUserOnline: presence.isUserOnline,
          showOnlinePresence: presence.showOnlinePresence,
          doNotDisturb: presence.doNotDisturb,
        }),
      );
    }

    return presenceMap;
  }, [presenceInRoom]);

  const getUserPresence = (userId: string) =>
    userPresenceMap.get(userId) ?? {
      showOnlinePresence: true,
      doNotDisturb: false,
      isUserOnline: false,
    };

  return (
    <div className="flex h-full">
      {currentUser && (
        <>
          <div className="flex w-full flex-col items-center justify-center py-4 md:w-[75%] lg:w-1/2">
            {conversationsToDisplay ? (
              conversationsToDisplay.length > 0 ? (
                <ScrollArea
                  className="h-full w-full px-4"
                  styleNameViewport={{
                    maxHeight: `calc(${screenHeight}px - ${navbarHeight}px - 32px)`,
                  }}
                >
                  <div
                    className="flex flex-col gap-y-4"
                    ref={scrollAreaContentRef}
                  >
                    {conversationsToDisplay.map((conversation) => {
                      const currentUserConversationStatus =
                        conversation.participants.find(
                          (participant) =>
                            participant.userId === currentUser._id,
                        )?.status;

                      const otherUser = conversation.users.find(
                        (user) => user?._id !== currentUser._id,
                      );

                      if (
                        (currentUserConversationStatus &&
                          currentUserConversationStatus !== "member") ||
                        !otherUser
                      ) {
                        if (conversationsToDisplay.length === 1) {
                          return (
                            <div
                              key="no-conversations"
                              className="flex w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row"
                              style={{
                                height: `calc(${screenHeight}px - ${navbarHeight}px - 32px)`,
                              }}
                            >
                              <MessageSquare className="h-5 w-5 shrink-0" />
                              <p>No conversations found.</p>
                            </div>
                          );
                        }

                        return null;
                      }

                      const { showOnlinePresence, doNotDisturb, isUserOnline } =
                        getUserPresence(otherUser._id);

                      return (
                        <div
                          key={`conversation-${otherUser._id}`}
                          className="flex h-full w-full flex-col gap-y-4 md:flex-none"
                        >
                          <ConversationUser
                            otherUser={otherUser}
                            conversation={conversation}
                            showOnlinePresence={showOnlinePresence}
                            doNotDisturb={doNotDisturb}
                            isUserOnline={isUserOnline}
                          />
                          {!matchesMdMediaQuery && activeConversation && (
                            <ConversationsArea currentUser={currentUser} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row">
                  <MessageSquare className="h-5 w-5 shrink-0" />
                  <p>No conversations found.</p>
                </div>
              )
            ) : (
              <Spinner type="circular" size="sm" />
            )}
          </div>
          {matchesMdMediaQuery && (
            <ConversationsArea currentUser={currentUser} />
          )}
        </>
      )}
    </div>
  );
}
