"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePaginatedQuery, useMutation } from "convex/react";
import { Bell, BellMinus, BellRing, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { cn, handleError } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useLayoutStore } from "@/stores/use-layout-store";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Notifications() {
  const [isPending, startTransition] = useTransition();
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const dropdownMenuContentRef = useRef<HTMLDivElement | null>(null);
  const clearNotification = useMutation(api.notifications.clearNotification);
  const clearAllNotifications = useMutation(
    api.notifications.clearAllNotifications,
  );
  const { position } = useLayoutStore();
  const {
    results: notifications,
    status,
    isLoading,
    loadMore,
  } = usePaginatedQuery(
    api.notifications.getNotifications,
    {},
    {
      initialNumItems: 3,
    },
  );

  useEffect(() => {
    if (notifications.length === 0 && status === "CanLoadMore") {
      loadMore(3);
    }
  }, [loadMore, notifications, status]);

  function handleClearNotification(notificationId: Id<"notifications">) {
    startTransition(async () => {
      try {
        await clearNotification({ notificationId });
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  function handleClearAllNotifications() {
    startTransition(async () => {
      try {
        await clearAllNotifications();
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <DropdownMenu
      open={isDropdownMenuOpen}
      onOpenChange={setIsDropdownMenuOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          className={cn({
            "text-from hover:bg-from/10 hover:text-from":
              notifications.length > 0,
          })}
          variant="ghost"
          size="icon"
          onClick={() => setIsDropdownMenuOpen(true)}
        >
          {notifications.length > 0 ? (
            <BellRing className="h-5 w-5 shrink-0 animate-swing" />
          ) : (
            <Bell className="h-5 w-5 shrink-0" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex w-72 flex-col items-center gap-y-2 p-0"
        ref={dropdownMenuContentRef}
        align={position === "left" ? "end" : "start"}
        sideOffset={10}
      >
        <div className="flex w-full flex-col items-center justify-center">
          {isLoading ? (
            <div
              className="flex w-full items-center justify-center"
              style={{
                height: dropdownMenuContentRef.current
                  ? dropdownMenuContentRef.current.clientHeight
                  : 0,
              }}
            >
              <Spinner type="circular" size="icon" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-12 items-center gap-x-2 text-muted-foreground">
              <BellRing className="h-4 w-4 shrink-0" />
              <p>No notifications.</p>
            </div>
          ) : (
            <ScrollArea className="p-3 pb-0" classNameViewport="max-h-60">
              <div className="flex flex-col gap-y-1">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={`notification-${notification._id}`}
                    className="flex w-full flex-col gap-y-4 bg-from/10 p-2 focus:bg-from/20"
                    onSelect={(event) => event.preventDefault()}
                  >
                    <p className="break-all font-medium text-muted-foreground">
                      {notification.message}
                    </p>
                    <Button
                      className="flex h-fit cursor-pointer items-center gap-x-1 self-start bg-transparent p-0 text-foreground hover:bg-transparent"
                      disabled={isPending}
                      onClick={() => handleClearNotification(notification._id)}
                    >
                      <BellMinus className="h-3 w-3 shrink-0" />
                      <p className="text-xs">Clear notification</p>
                    </Button>
                  </DropdownMenuItem>
                ))}
              </div>
            </ScrollArea>
          )}
          {!isLoading && notifications.length > 0 && (
            <DropdownMenuItem
              className="w-full justify-center p-2 focus:bg-transparent"
              onSelect={(event) => event.preventDefault()}
            >
              <Button
                className="flex h-fit cursor-pointer items-center gap-x-1 self-start bg-transparent p-0 text-foreground hover:bg-transparent"
                disabled={isPending}
                onClick={() => handleClearAllNotifications()}
              >
                <BellMinus className="h-3 w-3 shrink-0" />
                <p className="text-xs">Clear all notifications</p>
              </Button>
            </DropdownMenuItem>
          )}
          {status === "CanLoadMore" && (
            <DropdownMenuItem
              className="w-full justify-center p-2 focus:bg-transparent"
              onSelect={(event) => {
                event.preventDefault();

                loadMore(3);
              }}
            >
              <p className="animate-pulse cursor-pointer">
                <ChevronDown className="h-4 w-4 shrink-0" />
              </p>
            </DropdownMenuItem>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
