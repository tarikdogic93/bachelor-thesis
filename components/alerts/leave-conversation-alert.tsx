"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { useMediaQuery } from "usehooks-ts";
import { Minus } from "lucide-react";
import { toast } from "sonner";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useChatStore } from "@/stores/use-chat-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";
import { LoadingButton } from "@/components/buttons/loading-button";

type LeaveConversationAlertProps = {
  conversation: Doc<"conversations"> & {
    users: (Doc<"users"> | null)[];
  };
};

export default function LeaveConversationAlert({
  conversation,
}: LeaveConversationAlertProps) {
  const [isPending, startTransition] = useTransition();
  const { resetChatStore } = useChatStore();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const matchesMdMediaQuery = useMediaQuery("(min-width: 768px)");
  const leaveConversation = useMutation(api.conversations.leaveConversation);

  function handleLeaveConversation() {
    startTransition(async () => {
      try {
        await leaveConversation({ conversationId: conversation._id });

        resetChatStore();

        setIsAlertDialogOpen(false);
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <AlertDialog open={isAlertDialogOpen}>
      <Hint
        side={matchesMdMediaQuery ? "right" : "left"}
        sideOffset={10}
        label="Leave conversation"
        asChild
      >
        <AlertDialogTrigger asChild>
          <Button
            className="h-[22px] w-[22px] rounded-full"
            variant="destructive"
            size="icon"
            onClick={(event) => {
              event.stopPropagation();

              setIsAlertDialogOpen(true);
            }}
          >
            <Minus className="h-4 w-4 shrink-0" />
          </Button>
        </AlertDialogTrigger>
      </Hint>
      <AlertDialogContent
        onOverlayClick={(event) => {
          event.stopPropagation();

          setIsAlertDialogOpen(false);
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to leave this conversation?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove all your messages. You won&apos;t be
            able to access or recover them afterwards.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(event) => {
              event.stopPropagation();

              setIsAlertDialogOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            {isPending ? (
              <LoadingButton text="Leaving..." />
            ) : (
              <Button
                onClick={(event) => {
                  event.stopPropagation();

                  handleLeaveConversation();
                }}
              >
                Confirm
              </Button>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
