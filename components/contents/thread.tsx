"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { useMutation, useQuery } from "convex/react";
import { CircleAlert, Dot, ListTree, LogIn, LogOut, Users } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { cn, formatNumber, handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useForumStore } from "@/stores/use-forum-store";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Hint from "@/components/ui/hint";
import { LoadingButton } from "@/components/buttons/loading-button";
import ThreadOptions from "@/components/contents/thread-options";

type ThreadProps = {
  currentUser?: Doc<"users"> | null;
  thread: Doc<"threads">;
};

export default function Thread({ currentUser, thread }: ThreadProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { activeThread, setActiveThread, resetForumStore } = useForumStore();
  const userWhoCreatedThread = useQuery(api.users.getUserById, {
    userId: thread.userId,
  });
  const postsInfo = useQuery(api.posts.getPostsInfo, {
    threadId: thread._id,
  });
  const joinThread = useMutation(api.threads.joinThread);
  const leaveThread = useMutation(api.threads.leaveThread);

  const hasCurrentUserJoinedThread = useMemo(
    () => thread.memberIds?.find((memberId) => memberId === currentUser?._id),
    [currentUser, thread],
  );

  function handleThreadJoin() {
    startTransition(async () => {
      try {
        await joinThread({ threadId: thread._id });
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  function handleThreadLeave() {
    startTransition(async () => {
      try {
        await leaveThread({ threadId: thread._id });

        resetForumStore();
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <Card
      className={cn("h-fit", {
        "bg-muted/20": activeThread?._id === thread._id,
      })}
    >
      <CardContent className="flex flex-col justify-between gap-y-4 p-4">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center justify-between gap-x-2">
              <p className="max-w-80 truncate font-semibold">{thread.title}</p>
              <ThreadOptions currentUser={currentUser} thread={thread} />
            </div>
            <p className="flex items-center text-xs text-muted-foreground">
              {userWhoCreatedThread && (
                <>
                  <span className="max-w-48 truncate font-medium text-accent-foreground">
                    {userWhoCreatedThread.firstName}{" "}
                    {userWhoCreatedThread.lastName}
                  </span>
                  <Dot className="h-4 w-4 shrink-0 translate-y-px" />
                </>
              )}
              <span className="whitespace-nowrap font-medium text-accent-foreground">
                {thread.updateTime
                  ? `${format(thread.updateTime, "PPP")} (Edited)`
                  : format(thread._creationTime, "PPP")}
              </span>
            </p>
          </div>
          {thread.image && (
            <div className="relative h-48 w-full">
              <Image
                className="rounded-md object-cover"
                src={thread.image.url}
                alt="Thread image"
                fill
              />
            </div>
          )}
          {thread.description ? (
            <p className="break-words text-sm text-muted-foreground">
              {thread.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No description available.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-y-4">
          <Separator />
          <div className="flex flex-col items-start gap-y-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-x-6">
              <Hint label="Members" side="bottom" sideOffset={10}>
                <div className="flex items-center gap-x-1.5">
                  <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="font-semibold">
                    {thread.memberIds
                      ? formatNumber(thread.memberIds.length)
                      : 0}
                  </span>
                </div>
              </Hint>
              {postsInfo !== undefined && (
                <Hint label="Posts" side="bottom" sideOffset={10}>
                  <div className="flex items-center gap-x-1.5">
                    <ListTree className="h-4 w-4 shrink-0" />
                    <span className="font-semibold">
                      {postsInfo.postsNumber}
                    </span>
                  </div>
                </Hint>
              )}
              {currentUser?.role !== "Admin" &&
                postsInfo !== undefined &&
                postsInfo.unseenPostsNumber > 0 && (
                  <Hint label="Unseen posts" side="bottom" sideOffset={10}>
                    <div className="flex items-center gap-x-1.5">
                      <CircleAlert className="h-4 w-4 shrink-0 text-from" />
                      <span className="font-semibold">
                        {postsInfo.unseenPostsNumber}
                      </span>
                    </div>
                  </Hint>
                )}
            </div>
            {!hasCurrentUserJoinedThread && currentUser?.role !== "Admin" ? (
              isPending ? (
                <LoadingButton variant="outline" />
              ) : (
                <Hint label="Join thread" side="bottom" sideOffset={10} asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleThreadJoin}
                  >
                    <LogIn className="h-4 w-4 shrink-0" />
                  </Button>
                </Hint>
              )
            ) : (
              <div className="flex items-center gap-x-2">
                {currentUser?.role !== "Admin" &&
                  currentUser?._id !== thread.userId && (
                    <>
                      {isPending ? (
                        <LoadingButton variant="outline" />
                      ) : (
                        <Hint
                          label="Leave thread"
                          side="bottom"
                          sideOffset={10}
                          asChild
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleThreadLeave}
                          >
                            <LogOut className="h-4 w-4 shrink-0" />
                          </Button>
                        </Hint>
                      )}
                    </>
                  )}
                <Hint label="View posts" side="bottom" sideOffset={10} asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setActiveThread(thread);

                      router.push("/dashboard/forum/posts");
                    }}
                  >
                    <ListTree className="h-4 w-4 shrink-0" />
                  </Button>
                </Hint>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
