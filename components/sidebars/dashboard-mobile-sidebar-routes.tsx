"use client";

import { useUser } from "@clerk/nextjs";

import { mobileSidebarRoutes } from "@/data/mobile-sidebar-data";
import DashboardMobileSidebarItem from "@/components/sidebars/dashboard-mobile-sidebar-item";

export default function DashboardMobileSidebarRoutes() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const items = mobileSidebarRoutes.find(
    (route) => route.role === user.publicMetadata["role"],
  )?.items;

  return (
    <div className="flex flex-col gap-y-2">
      {user &&
        items?.map((item) => (
          <DashboardMobileSidebarItem key={item.href} item={item} />
        ))}
    </div>
  );
}
