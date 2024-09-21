"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { ListTree, MessageCircle, Plus, Route } from "lucide-react";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { useForumStore } from "@/stores/use-forum-store";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import Hint from "@/components/ui/hint";
import Comment from "@/components/contents/comment";

type CommentsContentProps = {
  parentCommentId?: Id<"comments">;
  level: number;
};

export default function CommentsContent({
  parentCommentId,
  level,
}: CommentsContentProps) {
  const { handleOpen } = useModalStore();
  const {
    activeThread,
    activePost,
    flattenedComments,
    addFlattenedComment,
    toggleFlattenedComment,
  } = useForumStore();
  const currentUser = useQuery(api.users.currentUser);
  const comments = useQuery(api.comments.getComments, {
    postId: activePost?._id,
    parentCommentId,
  });
  const parentComment = useQuery(api.comments.getCommentById, {
    commentId: parentCommentId,
  });
  const markCommentsAsSeen = useMutation(api.comments.markCommentsAsSeen);

  const handleMarkCommentsAsSeen = useCallback(
    async (userId: Id<"users">) => {
      if (comments) {
        const unseenCommentIds = comments
          .filter((comment) => !comment.seenByIds.includes(userId))
          .map((comment) => comment._id);

        if (unseenCommentIds.length > 0) {
          await markCommentsAsSeen({ commentIds: unseenCommentIds });
        }
      }
    },
    [markCommentsAsSeen, comments],
  );

  useEffect(() => {
    if (comments) {
      comments.forEach((comment) => {
        addFlattenedComment(comment, level, parentCommentId);
      });

      if (currentUser && currentUser.role !== "Admin") {
        handleMarkCommentsAsSeen(currentUser._id);
      }
    }
  }, [
    currentUser,
    comments,
    level,
    parentCommentId,
    addFlattenedComment,
    handleMarkCommentsAsSeen,
  ]);

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-between",
        {
          "gap-y-6 p-8": level === 0,
          hidden: level > 0 && (!comments || comments.length === 0),
        },
      )}
    >
      {activeThread ? (
        activePost ? (
          <>
            {level === 0 && (
              <div className="flex w-full flex-col-reverse items-center gap-y-4 md:flex-row md:justify-end">
                {currentUser?.role === "Applicant" && (
                  <Hint label="Add comment" side="left" sideOffset={10} asChild>
                    <Button
                      className="gap-x-2 rounded-full"
                      variant="outline"
                      onClick={() =>
                        handleOpen("manageComment", { post: activePost })
                      }
                    >
                      <MessageCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <Separator
                        className="bg-muted-foreground"
                        orientation="vertical"
                      />
                      <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Button>
                  </Hint>
                )}
              </div>
            )}
            <div
              className={cn("flex w-full flex-1", {
                "items-center justify-center": level === 0 && !comments,
              })}
            >
              {comments ? (
                comments.length === 0 ? (
                  level === 0 && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row">
                      <MessageCircle className="h-5 w-5 shrink-0" />
                      <p>No comments found.</p>
                    </div>
                  )
                ) : (
                  <div className="flex w-full flex-col">
                    {comments.map((comment) => {
                      const isCommentExpanded =
                        flattenedComments.find(
                          (obj) => obj.comment._id === comment._id,
                        )?.expanded || false;

                      return (
                        <Fragment key={`comment-${comment._id}`}>
                          <Comment
                            currentUser={currentUser}
                            activePost={activePost}
                            parentComment={parentComment}
                            comment={comment}
                            flattenedComments={flattenedComments}
                            handleExpand={() =>
                              toggleFlattenedComment(comment._id)
                            }
                            isExpandable={comment.numberOfReplies > 0}
                            isExpanded={isCommentExpanded}
                            level={level}
                          />
                          {isCommentExpanded && (
                            <CommentsContent
                              parentCommentId={comment._id}
                              level={level + 1}
                            />
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                )
              ) : (
                level === 0 && <Spinner type="circular" size="sm" />
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-y-5">
            <div className="flex items-center gap-x-2 text-muted-foreground">
              <ListTree className="h-5 w-5 shrink-0" />
              <p>No post selected.</p>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/dashboard/forum/posts">View posts</Link>
            </Button>
          </div>
        )
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-y-5">
          <div className="flex items-center gap-x-2 text-muted-foreground">
            <Route className="h-5 w-5 shrink-0" />
            <p>No thread selected.</p>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard/forum/threads">View threads</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
