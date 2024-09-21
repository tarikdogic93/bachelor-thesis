"use client";

import { useMediaQuery } from "usehooks-ts";
import { useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores/use-layout-store";
import DashboardMobileSidebar from "@/components/sidebars/dashboard-mobile-sidebar";
import DashboardNavbarRoutes from "@/components/navbars/dashboard-navbar-routes";
import CollapseExpandButtons from "@/components/buttons/collapse-expand-buttons";
import Notifications from "@/components/navbars/notifications";
import Signout from "@/components/navbars/signout";

export default function DashboardNavbar() {
  const matchesXlMediaQuery = useMediaQuery("(min-width: 1280px)");
  const { position } = useLayoutStore();
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  return (
    <div id="dashboard-navbar" className="min-h-16 border-b p-3 shadow-sm">
      <div
        className={cn("flex h-full items-center justify-between", {
          "flex-row-reverse": position === "right",
        })}
      >
        {matchesXlMediaQuery ? (
          <>
            <CollapseExpandButtons />
            <DashboardNavbarRoutes />
          </>
        ) : (
          <DashboardMobileSidebar />
        )}
        <div className="flex items-center gap-x-4">
          <Notifications />
          <Signout />
        </div>
      </div>
    </div>
  );
}
