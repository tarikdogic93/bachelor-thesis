"use client";

import { useQuery } from "convex/react";
import { useMediaQuery } from "usehooks-ts";
import { Dot, MinusCircle, PlusCircle } from "lucide-react";
import { format } from "date-fns";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Hint from "@/components/ui/hint";
import CommentOptions from "@/components/contents/comment-options";

type CommentProps = {
  currentUser?: Doc<"users"> | null;
  activePost: Doc<"posts">;
  parentComment?: Doc<"comments"> | null;
  comment: Doc<"comments">;
  handleExpand: () => void;
  isExpandable: boolean;
  isExpanded: boolean;
  flattenedComments: {
    comment: Doc<"comments">;
    level: number;
  }[];
  level: number;
};

export default function Comment({
  currentUser,
  activePost,
  comment,
  parentComment,
  handleExpand,
  isExpandable,
  isExpanded,
  flattenedComments,
  level,
}: CommentProps) {
  const matchesMdMediaQuery = useMediaQuery("(min-width: 768px)");
  const userWhoCreatedParentComment = useQuery(api.users.getUserById, {
    userId: parentComment?.userId,
  });
  const userWhoCreatedComment = useQuery(api.users.getUserById, {
    userId: comment.userId,
  });

  return (
    <div
      className="relative w-full gap-x-4 pb-2 md:flex md:w-fit"
      style={{
        paddingLeft: level
          ? matchesMdMediaQuery
            ? `${level * 40}px`
            : level > 0
              ? "20px"
              : undefined
          : undefined,
      }}
    >
      {level > 0 && matchesMdMediaQuery && (
        <>
          <div
            className="absolute -top-2 h-7 w-5 rounded-bl-full border-b-2 border-l-2 border-from"
            style={{
              left: level ? `${(level - 1) * 21 + level * 19}px` : undefined,
            }}
          />
          {[...Array(level)].map((_, index) => {
            const commentIndex = flattenedComments.findIndex(
              (obj) => obj.comment._id === comment._id,
            );

            const commentsBeforeIndex = flattenedComments.slice(
              0,
              commentIndex,
            );

            const commentsAfterIndex = flattenedComments.slice(
              commentIndex + 1,
            );

            const commentAfterIndexThatHasConnection = commentsAfterIndex.find(
              (obj) => obj.level - 1 === index,
            );

            const parentInCommentsBeforeIndex = commentsBeforeIndex.find(
              (obj) =>
                obj.comment._id ===
                commentAfterIndexThatHasConnection?.comment.parentCommentId,
            );

            if (
              commentAfterIndexThatHasConnection &&
              parentInCommentsBeforeIndex
            ) {
              return (
                <div
                  key={`comments-connection-${index}`}
                  className="absolute top-0 h-full border-l-2 border-from"
                  style={{
                    left: level
                      ? `${index * 21 + (index + 1) * 19}px`
                      : undefined,
                  }}
                />
              );
            } else {
              return null;
            }
          })}
        </>
      )}
      <div className="flex flex-1 flex-col items-center">
        {matchesMdMediaQuery && (
          <>
            {userWhoCreatedComment ? (
              <Hint
                label={`${userWhoCreatedComment.firstName} ${userWhoCreatedComment.lastName}`}
                side="left"
                sideOffset={10}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userWhoCreatedComment.imageUrl} />
                  <AvatarFallback>
                    {userWhoCreatedComment.firstName?.[0]}
                    {userWhoCreatedComment.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Hint>
            ) : (
              <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
            )}
          </>
        )}
        {isExpandable && matchesMdMediaQuery && (
          <>
            <div className="h-full w-0.5 bg-from" />
            <div className="cursor-pointer" onClick={handleExpand}>
              {isExpanded ? (
                <MinusCircle className="h-6 w-6 shrink-0" />
              ) : (
                <PlusCircle className="h-6 w-6 shrink-0" />
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex max-w-2xl flex-col gap-y-3 rounded-md bg-muted/20 p-3 md:rounded-tl-none">
        {!matchesMdMediaQuery && (
          <div>
            {userWhoCreatedComment ? (
              <Hint
                label={`${userWhoCreatedComment.firstName} ${userWhoCreatedComment.lastName}`}
                side="right"
                sideOffset={10}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userWhoCreatedComment.imageUrl} />
                  <AvatarFallback>
                    {userWhoCreatedComment.firstName?.[0]}
                    {userWhoCreatedComment.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Hint>
            ) : (
              <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
            )}
          </div>
        )}
        <div className="flex flex-col gap-y-1">
          <p className="flex items-center text-xs text-muted-foreground">
            {userWhoCreatedComment && (
              <>
                <span className="max-w-20 truncate font-medium text-accent-foreground sm:max-w-96">
                  {userWhoCreatedComment.firstName}{" "}
                  {userWhoCreatedComment.lastName}
                </span>
                <Dot className="h-4 w-4 shrink-0 translate-y-px" />
              </>
            )}
            <span className="whitespace-nowrap font-medium text-accent-foreground">
              {comment.updateTime
                ? `${format(comment.updateTime, "PPP")} (Edited)`
                : format(comment._creationTime, "PPP")}
            </span>
          </p>
          <p className="max-w-64 truncate text-xs text-muted-foreground md:max-w-96">
            On post:{" "}
            <span className="font-medium text-accent-foreground">
              {activePost.title}
            </span>
          </p>
        </div>
        <p className="break-all text-sm text-muted-foreground">
          {userWhoCreatedParentComment && !matchesMdMediaQuery && (
            <span className="font-medium text-from">
              @
              {`${userWhoCreatedParentComment.firstName} ${userWhoCreatedParentComment.lastName}`}
            </span>
          )}{" "}
          {comment.text}
        </p>
        <div className="flex items-center gap-x-2">
          {isExpandable && !matchesMdMediaQuery && (
            <>
              {matchesMdMediaQuery && <div className="h-full w-0.5 bg-from" />}
              <div className="cursor-pointer" onClick={handleExpand}>
                {isExpanded ? (
                  <MinusCircle className="h-6 w-6 shrink-0" />
                ) : (
                  <PlusCircle className="h-6 w-6 shrink-0" />
                )}
              </div>
            </>
          )}
          {(currentUser?.role === "Applicant" ||
            currentUser?.role === "Admin") && (
            <CommentOptions currentUser={currentUser} comment={comment} />
          )}
        </div>
      </div>
    </div>
  );
}
