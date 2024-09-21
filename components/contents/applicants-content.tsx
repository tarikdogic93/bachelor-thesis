"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { List, PersonStanding } from "lucide-react";
import { useDebounceValue, useMediaQuery } from "usehooks-ts";

import { api } from "@/convex/_generated/api";
import { useJobsStore } from "@/stores/use-jobs-store";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/inputs/search-input";
import Applicant from "@/components/contents/applicant";

export default function ApplicantsContent() {
  const { activeJob } = useJobsStore();
  const matchesMdMediaQuery = useMediaQuery("(min-width: 768px)");
  const [debouncedSearchValue, setDebouncedSearchValue] = useDebounceValue(
    "",
    500,
  );
  const currentUser = useQuery(api.users.currentUser);
  const {
    results: applicants,
    status,
    isLoading,
    loadMore,
  } = usePaginatedQuery(
    api.jobApplicants.getJobApplicants,
    {
      jobId: activeJob?._id,
      searchText: debouncedSearchValue,
    },
    { initialNumItems: 2 },
  );

  useEffect(() => {
    if (applicants.length === 0 && status === "CanLoadMore") {
      loadMore(2);
    }
  }, [loadMore, applicants, status]);

  const firstColumn = useMemo(() => {
    if (matchesMdMediaQuery) {
      return applicants.filter((_, index) => index % 2 === 0);
    }
  }, [applicants, matchesMdMediaQuery]);

  const secondColumn = useMemo(() => {
    if (matchesMdMediaQuery) {
      return applicants.filter((_, index) => index % 2 === 1);
    }
  }, [applicants, matchesMdMediaQuery]);

  return (
    <div className="flex h-full flex-col items-center justify-between gap-y-6 p-8">
      <div className="flex w-full items-center justify-between">
        <SearchInput
          className="w-full md:w-1/3"
          placeholder="Search by full name or email address"
          onChange={(event) => setDebouncedSearchValue(event.target.value)}
        />
      </div>
      {activeJob ? (
        <div className="flex w-full flex-1 items-center justify-center">
          {isLoading ? (
            <Spinner type="circular" size="sm" />
          ) : applicants.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row">
              <PersonStanding className="h-5 w-5 shrink-0" />
              <p>No applicants found.</p>
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 gap-4 self-start md:grid-cols-2">
              {matchesMdMediaQuery ? (
                <>
                  <div className="flex flex-col gap-y-4">
                    {firstColumn?.map((applicant) => {
                      if (!applicant) {
                        return null;
                      }

                      return (
                        <Applicant
                          key={`applicant-${applicant._id}`}
                          currentUser={currentUser}
                          activeJob={activeJob}
                          applicant={applicant}
                        />
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-y-4">
                    {secondColumn?.map((applicant) => {
                      if (!applicant) {
                        return null;
                      }

                      return (
                        <Applicant
                          key={`applicant-${applicant._id}`}
                          currentUser={currentUser}
                          activeJob={activeJob}
                          applicant={applicant}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  {applicants.map((applicant) => {
                    if (!applicant) {
                      return null;
                    }

                    return (
                      <Applicant
                        key={`applicant-${applicant._id}`}
                        currentUser={currentUser}
                        activeJob={activeJob}
                        applicant={applicant}
                      />
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-y-5">
          <div className="flex items-center gap-x-2 text-muted-foreground">
            <List className="h-5 w-5 shrink-0" />
            <p>No job listing selected.</p>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard/jobs/listings">View job listings</Link>
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
