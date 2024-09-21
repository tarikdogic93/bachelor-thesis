"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Dot,
  MessageCircle,
} from "lucide-react";

import { cn, formatNumber, handleError } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useForumStore } from "@/stores/use-forum-store";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import Hint from "@/components/ui/hint";
import TipTap from "@/components/ui/tip-tap";
import PostOptions from "@/components/contents/post-options";

type PostProps = {
  currentUser?: Doc<"users"> | null;
  activeThread: Doc<"threads">;
  post: Doc<"posts">;
};

export default function Post({ currentUser, activeThread, post }: PostProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { activePost, setActivePost } = useForumStore();
  const userWhoCreatedPost = useQuery(api.users.getUserById, {
    userId: post.userId,
  });
  const commentsInfo = useQuery(api.comments.getCommentsInfo, {
    postId: post._id,
  });
  const submitPostVote = useMutation(api.posts.submitPostVote);

  function handleSubmitPostVote(value: "up" | "down") {
    startTransition(async () => {
      try {
        await submitPostVote({ postId: post._id, value });
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <Card
      className={cn("h-fit", {
        "bg-muted/20": activePost?._id === post._id,
      })}
    >
      <CardContent className="p-0">
        <div className="flex w-full flex-col justify-between gap-y-4 p-4">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center justify-between gap-x-2">
                <p className="max-w-80 truncate font-semibold">{post.title}</p>
                <PostOptions currentUser={currentUser} post={post} />
              </div>
              <p className="max-w-80 truncate text-xs text-muted-foreground">
                In thread:{" "}
                <span className="font-medium text-accent-foreground">
                  {activeThread.title}
                </span>
              </p>
              <p className="flex items-center truncate text-xs text-muted-foreground">
                {userWhoCreatedPost && (
                  <>
                    <span className="max-w-48 truncate font-medium text-accent-foreground sm:max-w-56">
                      {userWhoCreatedPost.firstName}{" "}
                      {userWhoCreatedPost.lastName}
                    </span>
                    <Dot className="h-4 w-4 shrink-0 translate-y-px" />
                  </>
                )}
                <span className="whitespace-nowrap font-medium text-accent-foreground">
                  {post.updateTime
                    ? `${format(post.updateTime, "PPP")} (Edited)`
                    : format(post._creationTime, "PPP")}
                </span>
              </p>
            </div>
            {post.content ? (
              <TipTap
                className="text-muted-foreground"
                showMenubar={false}
                editable={false}
                contentJSON={JSON.parse(post.content)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No content available.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-4">
            <Separator />
            <div className="flex flex-col items-start gap-y-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-x-6">
                {commentsInfo !== undefined && (
                  <Hint label="Comments" side="bottom" sideOffset={10}>
                    <div className="flex items-center gap-x-1.5">
                      <MessageCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="font-semibold">
                        {formatNumber(commentsInfo.commentsNumber)}
                      </span>
                    </div>
                  </Hint>
                )}
                {currentUser?.role !== "Admin" &&
                  commentsInfo !== undefined &&
                  commentsInfo.unseenCommentsNumber > 0 && (
                    <Hint label="Unseen comments" side="bottom" sideOffset={10}>
                      <div className="flex items-center gap-x-1.5">
                        <CircleAlert className="h-4 w-4 shrink-0 text-from" />
                        <span className="font-semibold">
                          {formatNumber(commentsInfo.unseenCommentsNumber)}
                        </span>
                      </div>
                    </Hint>
                  )}
              </div>
              <div className="flex items-center gap-x-2">
                <div className="flex items-center rounded-md border">
                  <Button
                    className="hover:bg-transparent"
                    variant="ghost"
                    size="icon"
                    disabled={
                      currentUser?.role !== "Applicant" ||
                      !!post.votes.find(
                        (vote) =>
                          vote.userId === currentUser?._id &&
                          vote.value === "up",
                      ) ||
                      isPending
                    }
                    onClick={() => handleSubmitPostVote("up")}
                  >
                    <ChevronUp className="h-5 w-5 shrink-0" />
                  </Button>
                  <span className="h-6 font-semibold text-accent-foreground">
                    {formatNumber(
                      post.votes.reduce((score, vote) => {
                        return score + (vote.value === "up" ? 1 : 0);
                      }, 0),
                    )}
                  </span>
                  <Button
                    className="hover:bg-transparent"
                    variant="ghost"
                    size="icon"
                    disabled={
                      currentUser?.role !== "Applicant" ||
                      !!post.votes.find(
                        (vote) =>
                          vote.userId === currentUser?._id &&
                          vote.value === "down",
                      ) ||
                      isPending
                    }
                    onClick={() => handleSubmitPostVote("down")}
                  >
                    <ChevronDown className="h-5 w-5 shrink-0" />
                  </Button>
                </div>
                <Hint
                  label="View comments"
                  side="bottom"
                  sideOffset={10}
                  asChild
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setActivePost(post);

                      router.push("/dashboard/forum/comments");
                    }}
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" />
                  </Button>
                </Hint>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
