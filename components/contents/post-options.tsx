"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  Pencil,
  Trash2,
} from "lucide-react";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { useForumStore } from "@/stores/use-forum-store";
import { Button } from "@/components/ui/button";

type PostOptionsProps = {
  currentUser?: Doc<"users"> | null;
  post: Doc<"posts">;
};

export default function PostOptions({ currentUser, post }: PostOptionsProps) {
  const [isPending, startTransition] = useTransition();
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const { handleOpen } = useModalStore();
  const { resetActivePost, resetFlattenedComments } = useForumStore();
  const deletePost = useMutation(api.posts.deletePost);

  function handlePostDelete() {
    startTransition(async () => {
      try {
        await deletePost({ postId: post._id });

        resetActivePost();
        resetFlattenedComments();

        setAreOptionsVisible(false);
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <div className="flex items-center gap-x-1 self-start">
      {areOptionsVisible &&
        (currentUser?.role === "Admin" ||
          (currentUser?.role === "Applicant" &&
            currentUser?._id === post.userId)) && (
          <div className="flex items-center gap-x-1">
            {currentUser?.role === "Applicant" && (
              <Button
                className="h-6 w-6 rounded-full"
                variant="secondary"
                size="icon"
                disabled={isPending}
                onClick={() => handleOpen("managePost", { post })}
              >
                <Pencil className="h-3.5 w-3.5 shrink-0" />
              </Button>
            )}
            <Button
              className="h-6 w-6 rounded-full"
              variant="destructive"
              size="icon"
              disabled={isPending}
              onClick={handlePostDelete}
            >
              <Trash2 className="h-4 w-4 shrink-0" />
            </Button>
          </div>
        )}
      {(currentUser?.role === "Admin" ||
        (currentUser?.role === "Applicant" &&
          currentUser?._id === post.userId)) && (
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
    </div>
  );
}
