"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { SidebarItemType } from "@/data/sidebar-data";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";

type DashboardSidebarItemProps = {
  item: SidebarItemType;
};

export default function DashboardSidebarItem({
  item,
}: DashboardSidebarItemProps) {
  const pathname = usePathname();
  const { status: sidebarStatus } = useSidebarStore();

  const isFullyOpen = sidebarStatus === "fully-open";
  const isPathActive = pathname.includes(item.href);

  return (
    <>
      {isFullyOpen && (
        <Button
          className={cn("font-semibold", {
            "bg-accent text-accent-foreground": isPathActive,
          })}
          variant={item.special ? "special" : "outline"}
          asChild
        >
          <Link href={item.href}>
            {sidebarStatus === "fully-open" && (
              <div className="flex items-center gap-x-2">
                <span>{item.label}</span>
                <item.icon className="h-5 w-5 shrink-0" />
              </div>
            )}
          </Link>
        </Button>
      )}
      {sidebarStatus === "semi-open" && (
        <Hint side="right" sideOffset={10} label={item.label} asChild>
          <Button
            className={cn("rounded-full font-semibold", {
              "bg-accent text-accent-foreground": isPathActive && !item.special,
            })}
            variant={item.special ? "special" : "outline"}
            size="icon"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5 shrink-0" />
            </Link>
          </Button>
        </Hint>
      )}
    </>
  );
}
