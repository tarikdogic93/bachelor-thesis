"use client";

import { formatDistanceToNowStrict } from "date-fns";

import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import ConversationMessageOptions from "@/components/contents/conversation-message-options";

type ConversationMessageProps = {
  currentUser: Doc<"users">;
  message: Doc<"messages"> & {
    sender: Doc<"users"> | null;
  };
  isFirstMessageOfParticipant: boolean;
};

export default function ConversationMessage({
  currentUser,
  message,
  isFirstMessageOfParticipant,
}: ConversationMessageProps) {
  return (
    <div
      className={cn("group flex items-center gap-x-2", {
        "flex-row-reverse": message.senderId === currentUser?._id,
      })}
    >
      <div
        className={cn(
          "max-w-[50%] rounded-md border-none bg-primary/20 dark:bg-primary/40 sm:max-w-[55%] md:max-w-[60%] lg:max-w-[65%]",
          {
            "self-start": message.senderId !== currentUser?._id,
            "self-end": message.senderId === currentUser?._id,
            "rounded-tl-none":
              message.senderId !== currentUser?._id &&
              isFirstMessageOfParticipant,
            "rounded-tr-none":
              message.senderId === currentUser?._id &&
              isFirstMessageOfParticipant,
            "border border-dashed bg-transparent dark:bg-transparent":
              message.isDeleted,
          },
        )}
      >
        <div className="flex flex-col gap-y-3 break-all px-4 py-2">
          <p className="text-sm">
            {!message.isDeleted ? message.text : "Message deleted"}
          </p>
          {!message.isDeleted && (
            <p className="text-xs">
              {message.updateTime
                ? `Edited ${formatDistanceToNowStrict(message.updateTime)} ago`
                : `Sent ${formatDistanceToNowStrict(message._creationTime)} ago`}
            </p>
          )}
        </div>
      </div>
      <ConversationMessageOptions
        className="group-hover:flex"
        currentUser={currentUser}
        message={message}
      />
    </div>
  );
}
