"use client";

import { ReactNode, useCallback, useEffect } from "react";
import { useMutation } from "convex/react";
import { useMediaQuery } from "usehooks-ts";

import { api } from "@/convex/_generated/api";
import { useLayoutStore } from "@/stores/use-layout-store";
import DashboardSidebar from "@/components/sidebars/dashboard-sidebar";
import DashboardNavbar from "@/components/navbars/dashboard-navbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const matchesXlMediaQuery = useMediaQuery("(min-width: 1280px)");
  const { position } = useLayoutStore();
  const upsertPresence = useMutation(api.presence.upsertPresence);

  const handleUpsertPresence = useCallback(
    async () => await upsertPresence({ room: "dashboard" }),
    [upsertPresence],
  );

  useEffect(() => {
    handleUpsertPresence();

    const intervalId = setInterval(handleUpsertPresence, 10000);

    return () => clearInterval(intervalId);
  }, [handleUpsertPresence]);

  return (
    <>
      {matchesXlMediaQuery ? (
        <>
          {position === "left" ? (
            <>
              <DashboardSidebar />
              <main className="flex flex-1 flex-col overflow-y-auto">
                <DashboardNavbar />
                <div className="flex-1">{children}</div>
              </main>
            </>
          ) : (
            <>
              <main className="flex flex-1 flex-col overflow-y-auto">
                <DashboardNavbar />
                <div className="flex-1">{children}</div>
              </main>
              <DashboardSidebar />
            </>
          )}
        </>
      ) : (
        <main className="flex flex-1 flex-col overflow-y-auto">
          <DashboardNavbar />
          <div className="flex-1">{children}</div>
        </main>
      )}
    </>
  );
}
