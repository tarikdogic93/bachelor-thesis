"use client";

import { useEffect, useMemo } from "react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Users } from "lucide-react";
import { useDebounceValue, useMediaQuery } from "usehooks-ts";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/inputs/search-input";
import ChatUser from "@/components/contents/chat-user";

type ChatPageContentProps = {
  userRole: Exclude<Doc<"users">["role"], undefined>;
};

export default function ChatPageContent({ userRole }: ChatPageContentProps) {
  const matchesMdMediaQuery = useMediaQuery("(min-width: 768px)");
  const [debouncedSearchValue, setDebouncedSearchValue] = useDebounceValue(
    "",
    500,
  );
  const {
    results: users,
    status,
    isLoading,
    loadMore,
  } = usePaginatedQuery(
    api.users.getUsersByRole,
    {
      role: userRole,
      searchText: debouncedSearchValue,
    },
    { initialNumItems: 2 },
  );
  const presenceInRoom = useQuery(api.presence.getPresenceInRoom, {
    room: "dashboard",
  });

  useEffect(() => {
    if (users.length === 0 && status === "CanLoadMore") {
      loadMore(2);
    }
  }, [loadMore, users, status]);

  const userPresenceMap = useMemo(() => {
    const presenceMap = new Map<
      string,
      {
        showOnlinePresence: boolean;
        doNotDisturb: boolean;
        isUserOnline: boolean;
      }
    >();

    if (presenceInRoom) {
      presenceInRoom.forEach((presence) =>
        presenceMap.set(presence.userId, {
          isUserOnline: presence.isUserOnline,
          showOnlinePresence: presence.showOnlinePresence,
          doNotDisturb: presence.doNotDisturb,
        }),
      );
    }

    return presenceMap;
  }, [presenceInRoom]);

  const getUserPresence = (userId: string) =>
    userPresenceMap.get(userId) ?? {
      showOnlinePresence: true,
      doNotDisturb: false,
      isUserOnline: false,
    };

  const firstColumn = useMemo(() => {
    if (matchesMdMediaQuery) {
      return users.filter((_, index) => index % 2 === 0);
    }
  }, [users, matchesMdMediaQuery]);

  const secondColumn = useMemo(() => {
    if (matchesMdMediaQuery) {
      return users.filter((_, index) => index % 2 === 1);
    }
  }, [users, matchesMdMediaQuery]);

  return (
    <div className="flex h-full flex-col items-center justify-between gap-y-6 p-8">
      <div className="flex w-full items-center justify-between">
        <SearchInput
          className="w-full md:w-1/3"
          placeholder="Search by full name or email address"
          onChange={(event) => setDebouncedSearchValue(event.target.value)}
        />
      </div>
      <div className="flex w-full flex-1 items-center justify-center">
        {isLoading ? (
          <Spinner type="circular" size="sm" />
        ) : users.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row">
            <Users className="h-5 w-5 shrink-0" />
            <p>No users found.</p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 self-start md:grid-cols-2">
            {matchesMdMediaQuery ? (
              <>
                <div className="flex flex-col gap-y-4">
                  {firstColumn?.map((user) => {
                    const { showOnlinePresence, doNotDisturb, isUserOnline } =
                      getUserPresence(user._id);

                    return (
                      <ChatUser
                        key={`chat-user-${user._id}`}
                        user={user}
                        showOnlinePresence={showOnlinePresence}
                        doNotDisturb={doNotDisturb}
                        isUserOnline={isUserOnline}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-col gap-y-4">
                  {secondColumn?.map((user) => {
                    const { showOnlinePresence, doNotDisturb, isUserOnline } =
                      getUserPresence(user._id);

                    return (
                      <ChatUser
                        key={`chat-user-${user._id}`}
                        user={user}
                        showOnlinePresence={showOnlinePresence}
                        doNotDisturb={doNotDisturb}
                        isUserOnline={isUserOnline}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {users.map((user) => {
                  const { showOnlinePresence, doNotDisturb, isUserOnline } =
                    getUserPresence(user._id);

                  return (
                    <ChatUser
                      key={`chat-user-${user._id}`}
                      user={user}
                      showOnlinePresence={showOnlinePresence}
                      doNotDisturb={doNotDisturb}
                      isUserOnline={isUserOnline}
                    />
                  );
                })}
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
