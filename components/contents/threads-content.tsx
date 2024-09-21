"use client";

import { useEffect, useMemo } from "react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Plus, Route } from "lucide-react";
import { useDebounceValue, useMediaQuery } from "usehooks-ts";

import { api } from "@/convex/_generated/api";
import { useModalStore } from "@/stores/use-modal-store";
import Hint from "@/components/ui/hint";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/inputs/search-input";
import Thread from "@/components/contents/thread";

export default function ThreadsContent() {
  const { handleOpen } = useModalStore();
  const matchesMdMediaQuery = useMediaQuery("(min-width: 768px)");
  const [debouncedSearchValue, setDebouncedSearchValue] = useDebounceValue(
    "",
    500,
  );
  const currentUser = useQuery(api.users.currentUser);
  const {
    results: threads,
    status,
    isLoading,
    loadMore,
  } = usePaginatedQuery(
    api.threads.getThreads,
    {
      searchText: debouncedSearchValue,
    },
    { initialNumItems: 2 },
  );

  useEffect(() => {
    if (threads.length === 0 && status === "CanLoadMore") {
      loadMore(2);
    }
  }, [loadMore, threads, status]);

  const firstColumn = useMemo(() => {
    if (matchesMdMediaQuery) {
      return threads.filter((_, index) => index % 2 === 0);
    }
  }, [threads, matchesMdMediaQuery]);

  const secondColumn = useMemo(() => {
    if (matchesMdMediaQuery) {
      return threads.filter((_, index) => index % 2 === 1);
    }
  }, [threads, matchesMdMediaQuery]);

  return (
    <div className="flex h-full flex-col items-center justify-between gap-y-6 p-8">
      <div className="flex w-full flex-col-reverse items-center gap-y-4 md:flex-row md:justify-between">
        <SearchInput
          className="w-full md:w-1/3"
          placeholder="Search by title"
          onChange={(event) => setDebouncedSearchValue(event.target.value)}
        />
        {currentUser?.role === "Applicant" && (
          <Hint label="Create thread" side="left" sideOffset={10} asChild>
            <Button
              className="gap-x-2 rounded-full"
              variant="outline"
              onClick={() => handleOpen("manageThread")}
            >
              <Route className="h-4 w-4 shrink-0 text-muted-foreground" />
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
        ) : threads.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row">
            <Route className="h-5 w-5 shrink-0" />
            <p>No threads found.</p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 self-start md:grid-cols-2">
            {matchesMdMediaQuery ? (
              <>
                <div className="flex flex-col gap-y-4">
                  {firstColumn?.map((thread) => (
                    <Thread
                      key={`thread-${thread._id}`}
                      currentUser={currentUser}
                      thread={thread}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-y-4">
                  {secondColumn?.map((thread) => (
                    <Thread
                      key={`thread-${thread._id}`}
                      currentUser={currentUser}
                      thread={thread}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                {threads.map((thread) => (
                  <Thread
                    key={`thread-${thread._id}`}
                    currentUser={currentUser}
                    thread={thread}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
      {status === "CanLoadMore" && (
        <Button className="animate-pulse" onClick={() => loadMore(2)}>
          Load more
        </Button>
      )}
    </div>
  );
}
