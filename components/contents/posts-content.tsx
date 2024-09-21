"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo } from "react";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { ListTree, Plus, Route } from "lucide-react";
import { useDebounceValue, useMediaQuery } from "usehooks-ts";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useModalStore } from "@/stores/use-modal-store";
import { useForumStore } from "@/stores/use-forum-store";
import Hint from "@/components/ui/hint";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/inputs/search-input";
import Post from "@/components/contents/post";

export default function PostsContent() {
  const { handleOpen } = useModalStore();
  const { activeThread } = useForumStore();
  const matchesMdMediaQuery = useMediaQuery("(min-width: 768px)");
  const [debouncedSearchValue, setDebouncedSearchValue] = useDebounceValue(
    "",
    500,
  );
  const currentUser = useQuery(api.users.currentUser);
  const markPostsAsSeen = useMutation(api.posts.markPostsAsSeen);
  const {
    results: posts,
    status,
    isLoading,
    loadMore,
  } = usePaginatedQuery(
    api.posts.getPosts,
    {
      threadId: activeThread?._id,
      searchText: debouncedSearchValue,
    },
    { initialNumItems: 2 },
  );

  const handleMarkPostsAsSeen = useCallback(
    async (userId: Id<"users">) => {
      const unseenPostIds = posts
        .filter((post) => !post.seenByIds.includes(userId))
        .map((post) => post._id);

      if (unseenPostIds.length > 0) {
        await markPostsAsSeen({ postIds: unseenPostIds });
      }
    },
    [markPostsAsSeen, posts],
  );

  useEffect(() => {
    if (currentUser && currentUser.role !== "Admin") {
      handleMarkPostsAsSeen(currentUser._id);
    }

    if (posts.length === 0 && status === "CanLoadMore") {
      loadMore(2);
    }
  }, [currentUser, handleMarkPostsAsSeen, loadMore, posts, status]);

  const firstColumn = useMemo(() => {
    if (matchesMdMediaQuery) {
      return posts.filter((_, index) => index % 2 === 0);
    }
  }, [posts, matchesMdMediaQuery]);

  const secondColumn = useMemo(() => {
    if (matchesMdMediaQuery) {
      return posts.filter((_, index) => index % 2 === 1);
    }
  }, [posts, matchesMdMediaQuery]);

  return (
    <div className="flex h-full flex-col items-center justify-between gap-y-6 p-8">
      {activeThread ? (
        <>
          <div className="flex w-full flex-col-reverse items-center gap-y-4 md:flex-row md:justify-between">
            <SearchInput
              className="w-full md:w-1/3"
              placeholder="Search by title"
              onChange={(event) => setDebouncedSearchValue(event.target.value)}
            />
            {currentUser?.role === "Applicant" && (
              <Hint label="Create post" side="left" sideOffset={10} asChild>
                <Button
                  className="gap-x-2 rounded-full"
                  variant="outline"
                  onClick={() =>
                    handleOpen("managePost", { thread: activeThread })
                  }
                >
                  <ListTree className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Separator
                    className="bg-muted-foreground"
                    orientation="vertical"
                  />
                  <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </Hint>
            )}
          </div>
          <div className="flex w-full flex-1 items-center justify-center">
            {isLoading ? (
              <Spinner type="circular" size="sm" />
            ) : posts.length === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row">
                <ListTree className="h-5 w-5 shrink-0" />
                <p>No posts found.</p>
              </div>
            ) : (
              <div className="grid w-full grid-cols-1 gap-4 self-start md:grid-cols-2">
                {matchesMdMediaQuery ? (
                  <>
                    <div className="flex flex-col gap-y-4">
                      {firstColumn?.map((post) => (
                        <Post
                          key={`post-${post._id}`}
                          currentUser={currentUser}
                          activeThread={activeThread}
                          post={post}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col gap-y-4">
                      {secondColumn?.map((post) => (
                        <Post
                          key={`post-${post._id}`}
                          currentUser={currentUser}
                          activeThread={activeThread}
                          post={post}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {posts.map((post) => (
                      <Post
                        key={`post-${post._id}`}
                        currentUser={currentUser}
                        activeThread={activeThread}
                        post={post}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </>
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
      {status === "CanLoadMore" && (
        <Button className="animate-pulse" onClick={() => loadMore(2)}>
          Load more
        </Button>
      )}
    </div>
  );
}
