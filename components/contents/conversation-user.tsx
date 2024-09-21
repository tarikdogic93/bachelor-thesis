"use client";

import { useQuery } from "convex/react";
import { useMediaQuery } from "usehooks-ts";
import { CircleAlert, ShieldCheck, ShieldX, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useChatStore } from "@/stores/use-chat-store";
import Hint from "@/components/ui/hint";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import LeaveConversationAlert from "@/components/alerts/leave-conversation-alert";

type ConversationUserProps = {
  otherUser: Doc<"users">;
  conversation: Doc<"conversations"> & {
    users: (Doc<"users"> | null)[];
  };
  showOnlinePresence: boolean;
  doNotDisturb: boolean;
  isUserOnline: boolean;
};

export default function ConversationUser({
  otherUser,
  conversation,
  showOnlinePresence,
  doNotDisturb,
  isUserOnline,
}: ConversationUserProps) {
  const { activeConversation, setActiveConversation, resetChatStore } =
    useChatStore();
  const matchesMdMediaQuery = useMediaQuery("(min-width: 768px)");
  const messagesInfo = useQuery(api.messages.getMessagesInfo, {
    conversationId: conversation._id,
  });

  return (
    <Card
      id={`conversation-${otherUser._id}`}
      className={cn("cursor-pointer hover:bg-muted/20", {
        "cursor-default bg-muted/20":
          conversation._id === activeConversation?._id,
      })}
      onClick={() => {
        if (conversation._id !== activeConversation?._id) {
          setActiveConversation(conversation);
        }
      }}
    >
      <CardContent className="group flex items-center justify-between gap-x-2 p-4">
        <div className="flex items-center gap-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={otherUser.imageUrl} />
            <AvatarFallback>
              {otherUser.firstName[0]}
              {otherUser.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="max-w-36 truncate font-semibold tracking-wider">
              {otherUser.companyName
                ? otherUser.companyName
                : `${otherUser.firstName} ${otherUser.lastName}`}
            </p>
            <p className="max-w-36 truncate text-sm text-primary/80">
              {otherUser.emailAddress}
            </p>
            <div className="flex min-h-6 items-center gap-x-2">
              {doNotDisturb ? (
                <Hint label="Do not disturb" side="bottom" sideOffset={10}>
                  <ShieldX className="h-4 w-4 shrink-0 text-red-500" />
                </Hint>
              ) : (
                showOnlinePresence && (
                  <Hint
                    label={
                      isUserOnline ? "Currently online" : "Currently offline"
                    }
                    side="bottom"
                    sideOffset={10}
                  >
                    <ShieldCheck
                      className={cn("h-4 w-4 shrink-0", {
                        "text-green-500": isUserOnline,
                        "text-zinc-500": !isUserOnline,
                      })}
                    />
                  </Hint>
                )
              )}
              {!activeConversation &&
                messagesInfo !== undefined &&
                messagesInfo.unseenMessagesNumber > 0 && (
                  <Hint label="Unseen messages" side="bottom" sideOffset={10}>
                    <div className="flex items-center gap-x-1.5">
                      <CircleAlert className="h-4 w-4 shrink-0 text-from" />
                      <span className="font-semibold">
                        {messagesInfo.unseenMessagesNumber}
                      </span>
                    </div>
                  </Hint>
                )}
            </div>
          </div>
        </div>
        <div
          className={cn(
            "hidden flex-col items-center gap-y-2 group-hover:flex",
          )}
        >
          <LeaveConversationAlert conversation={conversation} />
          {conversation._id === activeConversation?._id && (
            <Hint
              side={matchesMdMediaQuery ? "right" : "left"}
              sideOffset={10}
              label="Close conversation"
              asChild
            >
              <Button
                className="h-[22px] w-[22px] rounded-full"
                size="icon"
                onClick={(event) => {
                  event.stopPropagation();

                  resetChatStore();
                }}
              >
                <X className="h-4 w-4 shrink-0" />
              </Button>
            </Hint>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
