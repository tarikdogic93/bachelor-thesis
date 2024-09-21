"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Ellipsis, Heart, Pencil, Trash2 } from "lucide-react";

import { cn, handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useChatStore } from "@/stores/use-chat-store";
import { Button } from "@/components/ui/button";

type ConversationMessageOptionsProps = {
  className?: string;
  currentUser: Doc<"users">;
  message: Doc<"messages"> & {
    sender: Doc<"users"> | null;
  };
};

export default function ConversationMessageOptions({
  className,
  currentUser,
  message,
}: ConversationMessageOptionsProps) {
  const [isPending, startTransition] = useTransition();
  const { setEditMessage, resetEditMessage } = useChatStore();
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const likeDislikeMessage = useMutation(api.messages.likeDislikeMessage);
  const deleteMessage = useMutation(api.messages.deleteMessage);

  function handleDeleteMessage() {
    startTransition(async () => {
      try {
        await deleteMessage({
          messageId: message._id,
        });

        setAreOptionsVisible(false);

        resetEditMessage();
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  function handleLikeDislikeMessage() {
    startTransition(async () => {
      try {
        await likeDislikeMessage({
          messageId: message._id,
        });
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <>
      {!message.isDeleted && (
        <Button
          className="h-7 w-7 rounded-full bg-transparent hover:bg-transparent"
          size="icon"
          disabled={message.senderId === currentUser?._id}
          onClick={handleLikeDislikeMessage}
        >
          <Heart
            className={cn("h-6 w-6 shrink-0 text-from", {
              "fill-from": message.likedByIds.length > 0,
            })}
          />
        </Button>
      )}
      <div
        className={cn(
          "hidden items-center gap-x-1",
          {
            "flex-row-reverse": message.senderId !== currentUser?._id,
          },
          className,
          {
            flex: areOptionsVisible,
          },
        )}
      >
        {areOptionsVisible &&
          message.senderId === currentUser?._id &&
          !message.isDeleted && (
            <div
              className={cn("flex items-center gap-x-1", {
                "flex-row-reverse": message.senderId === currentUser._id,
              })}
            >
              <Button
                className="h-6 w-6 rounded-full"
                variant="secondary"
                size="icon"
                disabled={isPending}
                onClick={() => setEditMessage(message)}
              >
                <Pencil className="h-3.5 w-3.5 shrink-0" />
              </Button>
              <Button
                className="h-6 w-6 rounded-full"
                variant="destructive"
                size="icon"
                disabled={isPending}
                onClick={handleDeleteMessage}
              >
                <Trash2 className="h-4 w-4 shrink-0" />
              </Button>
            </div>
          )}
        {message.senderId === currentUser?._id && !message.isDeleted && (
          <Button
            className="h-6 w-6 rounded-full bg-transparent"
            variant="outline"
            size="icon"
            onClick={() => setAreOptionsVisible(!areOptionsVisible)}
          >
            <Ellipsis className="h-4 w-4 shrink-0" />
          </Button>
        )}
      </div>
    </>
  );
}
