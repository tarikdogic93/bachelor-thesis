"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useJobsStore } from "@/stores/use-jobs-store";
import { useChatStore } from "@/stores/use-chat-store";
import { useForumStore } from "@/stores/use-forum-store";

export default function NavigationEvents() {
  const pathname = usePathname();
  const { resetJobsStore } = useJobsStore();
  const { resetChatStore } = useChatStore();
  const { resetForumStore } = useForumStore();
  const [isJobsRoute, setIsJobsRoute] = useState(false);
  const [isChatRoute, setIsChatRoute] = useState(false);
  const [isForumRoute, setIsForumRoute] = useState(false);

  useEffect(() => {
    setIsJobsRoute(pathname === "/dashboard/jobs");
    setIsChatRoute(pathname === "/dashboard/chat");
    setIsForumRoute(pathname === "/dashboard/forum");
  }, [pathname]);

  useEffect(() => {
    if (!isJobsRoute) {
      resetJobsStore();
    }

    if (!isChatRoute) {
      resetChatStore();
    }

    if (!isForumRoute) {
      resetForumStore();
    }
  }, [
    resetJobsStore,
    resetChatStore,
    resetForumStore,
    isChatRoute,
    isForumRoute,
    isJobsRoute,
  ]);

  return null;
}
