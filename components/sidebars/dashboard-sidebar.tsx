"use client";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores/use-layout-store";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { Button } from "@/components/ui/button";
import DashboardSidebarRoutes from "@/components/sidebars/dashboard-sidebar-routes";

export default function DashboardSidebar() {
  const { position } = useLayoutStore();
  const { status: sidebarStatus } = useSidebarStore();

  return (
    <div
      className={cn("flex w-60 flex-col border-r", {
        "border-l border-r-0": position === "right",
        "w-fit": sidebarStatus === "semi-open",
        hidden: sidebarStatus === "closed",
      })}
    >
      <div className="min-w-[4.5rem] p-3">
        <Button
          className="w-full dark:hover:bg-accent/40"
          variant="ghost"
          size={sidebarStatus === "fully-open" ? "default" : "icon"}
          asChild
        >
          <Link
            className="flex items-center justify-center gap-x-2"
            href="/dashboard"
          >
            <Image src="/icons/logo.svg" alt="Logo" width={26} height={26} />
            {sidebarStatus === "fully-open" && (
              <span className="text-lg font-semibold text-primary">
                ElysianStart
              </span>
            )}
          </Link>
        </Button>
      </div>
      <DashboardSidebarRoutes />
    </div>
  );
}
