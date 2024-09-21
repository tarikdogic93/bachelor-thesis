"use client";

import { useUser } from "@clerk/nextjs";

import { sidebarRoutes } from "@/data/sidebar-data";
import DashboardSidebarItem from "@/components/sidebars/dashboard-sidebar-item";

export default function DashboardSidebarRoutes() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const items = sidebarRoutes.find(
    (route) => route.role === user.publicMetadata["role"],
  )?.items;

  return (
    <div className="custom-scrollbar h-full min-w-[4.5rem] overflow-y-auto p-4">
      <div className="flex flex-1 flex-col gap-y-3">
        {user &&
          items?.map((item) => {
            return <DashboardSidebarItem key={item.href} item={item} />;
          })}
      </div>
    </div>
  );
}
