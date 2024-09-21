"use client";

import { useEffect, useMemo } from "react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { List, Plus } from "lucide-react";
import { useDebounceValue, useMediaQuery } from "usehooks-ts";

import { api } from "@/convex/_generated/api";
import { useModalStore } from "@/stores/use-modal-store";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";
import SearchInput from "@/components/inputs/search-input";
import Listing from "@/components/contents/listing";

export default function ListingsContent() {
  const { handleOpen } = useModalStore();
  const matchesMdMediaQuery = useMediaQuery("(min-width: 768px)");
  const [debouncedSearchValue, setDebouncedSearchValue] = useDebounceValue(
    "",
    500,
  );
  const currentUser = useQuery(api.users.currentUser);
  const {
    results: jobs,
    status,
    isLoading,
    loadMore,
  } = usePaginatedQuery(
    api.jobs.getJobs,
    {
      searchText: debouncedSearchValue,
    },
    { initialNumItems: 2 },
  );

  useEffect(() => {
    if (jobs.length === 0 && status === "CanLoadMore") {
      loadMore(2);
    }
  }, [loadMore, jobs, status]);

  const firstColumn = useMemo(() => {
    if (matchesMdMediaQuery) {
      return jobs.filter((_, index) => index % 2 === 0);
    }
  }, [jobs, matchesMdMediaQuery]);

  const secondColumn = useMemo(() => {
    if (matchesMdMediaQuery) {
      return jobs.filter((_, index) => index % 2 === 1);
    }
  }, [jobs, matchesMdMediaQuery]);

  return (
    <div className="flex h-full flex-col items-center justify-between gap-y-6 p-8">
      <div className="flex w-full flex-col-reverse items-center gap-y-4 md:flex-row md:justify-between">
        <SearchInput
          className="w-full md:w-1/3"
          placeholder="Search by title"
          onChange={(event) => setDebouncedSearchValue(event.target.value)}
        />
        {currentUser?.role === "Company" && (
          <Hint label="Create job listing" side="left" sideOffset={10} asChild>
            <Button
              className="gap-x-2 rounded-full"
              variant="outline"
              onClick={() => handleOpen("manageJob")}
            >
              <List className="h-4 w-4 shrink-0 text-muted-foreground" />
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
        ) : jobs.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row">
            <List className="h-5 w-5 shrink-0" />
            <p>No job listings found.</p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 self-start md:grid-cols-2">
            {matchesMdMediaQuery ? (
              <>
                <div className="flex flex-col gap-y-4">
                  {firstColumn?.map((job) => (
                    <Listing
                      key={`listing-${job._id}`}
                      currentUser={currentUser}
                      job={job}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-y-4">
                  {secondColumn?.map((job) => (
                    <Listing
                      key={`listing-${job._id}`}
                      currentUser={currentUser}
                      job={job}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                {jobs.map((job) => (
                  <Listing
                    key={`listing-${job._id}`}
                    currentUser={currentUser}
                    job={job}
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
