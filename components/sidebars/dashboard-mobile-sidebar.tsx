"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

import { useLayoutStore } from "@/stores/use-layout-store";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DashboardMobileSidebarRoutes from "@/components/sidebars/dashboard-mobile-sidebar-routes";

export default function DashboardMobileSidebar() {
  const { position } = useLayoutStore();
  const { setStatus } = useSidebarStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStatus("fully-open")}
        >
          <Menu className="h-5 w-5 shrink-0" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 py-6" side={position}>
        <SheetHeader className="sr-only">
          <SheetTitle>Dashboard navigation</SheetTitle>
          <SheetDescription>
            Navigate through your dashboard and access all the important
            sections of your application.
          </SheetDescription>
        </SheetHeader>
        <div className="flex h-full flex-col gap-y-4">
          <div className="min-w-[4.5rem] px-6 py-3">
            <Button
              className="w-full dark:hover:bg-accent/40"
              variant="ghost"
              asChild
            >
              <Link
                className="flex items-center justify-center gap-x-2"
                href="/dashboard"
              >
                <Image
                  src="/icons/logo.svg"
                  alt="Logo"
                  width={26}
                  height={26}
                />
                <span className="text-lg font-semibold text-primary">
                  ElysianStart
                </span>
              </Link>
            </Button>
          </div>
          <ScrollArea
            className="h-full w-full px-6"
            classNameViewport="max-h-full"
          >
            <DashboardMobileSidebarRoutes />
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
