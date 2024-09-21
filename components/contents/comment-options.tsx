"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  MessageCircleReply,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { useForumStore } from "@/stores/use-forum-store";
import { Button } from "@/components/ui/button";

type CommentOptionsProps = {
  currentUser?: Doc<"users"> | null;
  comment: Doc<"comments">;
};

export default function CommentOptions({
  currentUser,
  comment,
}: CommentOptionsProps) {
  const [isPending, startTransition] = useTransition();
  const { handleOpen } = useModalStore();
  const { removeFlattenedComments } = useForumStore();
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const deleteComment = useMutation(api.comments.deleteComment);

  function handleCommentDelete() {
    startTransition(async () => {
      try {
        const deletedCommentIds = await deleteComment({
          commentId: comment._id,
          parentCommentId: comment.parentCommentId,
        });

        removeFlattenedComments(deletedCommentIds);

        setAreOptionsVisible(false);
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <div className="flex items-center gap-x-1 self-start">
      {(currentUser?.role === "Applicant" || currentUser?.role === "Admin") && (
        <Button
          className="h-6 w-6 rounded-full"
          variant="outline"
          size="icon"
          onClick={() => setAreOptionsVisible(!areOptionsVisible)}
        >
          {areOptionsVisible ? (
            <ChevronsRightLeft className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronsLeftRight className="h-4 w-4 shrink-0" />
          )}
        </Button>
      )}
      {areOptionsVisible && (
        <div className="flex items-center gap-x-1">
          {currentUser?.role === "Applicant" && (
            <Button
              className="h-6 w-6 rounded-full"
              size="icon"
              disabled={isPending}
              onClick={() =>
                handleOpen("manageComment", { replyComment: comment })
              }
            >
              <MessageCircleReply className="h-4 w-4 shrink-0" />
            </Button>
          )}
          {currentUser?.role === "Applicant" &&
            currentUser?._id === comment.userId && (
              <Button
                className="h-6 w-6 rounded-full"
                variant="secondary"
                size="icon"
                disabled={isPending}
                onClick={() =>
                  handleOpen("manageComment", { editComment: comment })
                }
              >
                <Pencil className="h-3.5 w-3.5 shrink-0" />
              </Button>
            )}
          {(currentUser?.role === "Admin" ||
            (currentUser?.role === "Applicant" &&
              currentUser?._id === comment.userId)) && (
            <Button
              className="h-6 w-6 rounded-full"
              variant="destructive"
              size="icon"
              disabled={isPending}
              onClick={handleCommentDelete}
            >
              <Trash2 className="h-4 w-4 shrink-0" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
