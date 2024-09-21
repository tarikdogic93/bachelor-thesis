"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useMutation } from "convex/react";
import {
  CalendarDays,
  MessageSquare,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { cn, handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useChatStore } from "@/stores/use-chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Hint from "@/components/ui/hint";
import { Button } from "@/components/ui/button";

type ChatUserProps = {
  user: Doc<"users">;
  showOnlinePresence: boolean;
  doNotDisturb: boolean;
  isUserOnline: boolean;
};

export default function ChatUser({
  user,
  showOnlinePresence,
  doNotDisturb,
  isUserOnline,
}: ChatUserProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { setActiveConversation } = useChatStore();
  const createConversation = useMutation(api.conversations.createConversation);

  function handleCreateConversation() {
    startTransition(async () => {
      try {
        const conversation = await createConversation({
          type: "one-on-one",
          userIds: [user._id],
        });

        if (conversation) {
          setActiveConversation(conversation);
        }

        router.push("/dashboard/chat/conversations");
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-x-2 p-4">
        <div className="flex w-full flex-1 flex-col gap-y-4">
          <Avatar className="h-48 w-full rounded-md">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="rounded-md bg-gradient-to-b from-muted to-card">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex w-full flex-col justify-between gap-y-4 sm:flex-row sm:items-end">
            <div className="flex flex-col justify-between">
              <div className="flex items-center gap-x-2">
                <p className="max-w-52 truncate font-semibold">
                  {user.companyName
                    ? user.companyName
                    : `${user.firstName} ${user.lastName}`}
                </p>
                {doNotDisturb ? (
                  <Hint label="Do not disturb" side="right" sideOffset={10}>
                    <ShieldX className="h-4 w-4 shrink-0 text-red-500" />
                  </Hint>
                ) : (
                  showOnlinePresence && (
                    <Hint
                      label={
                        isUserOnline ? "Currently online" : "Currently offline"
                      }
                      side="right"
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
              </div>
              <p className="max-w-52 truncate text-sm text-primary/80">
                {user.emailAddress}
              </p>
              <div className="mt-2 flex items-center gap-x-2">
                <CalendarDays className="h-4 w-4 shrink-0 opacity-70" />
                <span className="max-w-44 truncate text-xs font-medium text-primary/50">
                  Joined {format(user._creationTime, "PPP")}
                </span>
              </div>
            </div>
            <Hint
              label="Initiate conversation"
              side="bottom"
              sideOffset={10}
              asChild
            >
              <Button
                variant="secondary"
                size="icon"
                disabled={isPending}
                onClick={handleCreateConversation}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
              </Button>
            </Hint>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
