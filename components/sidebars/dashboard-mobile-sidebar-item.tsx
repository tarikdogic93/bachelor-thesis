"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  MobileSidebarItemType,
  MobileSidebarSubItemType,
  MobileSidebarSubSubItemType,
} from "@/data/mobile-sidebar-data";
import { Button } from "@/components/ui/button";

type DashboardMobileSidebarItemProps = {
  item?: MobileSidebarItemType;
  subItem?: MobileSidebarSubItemType;
  subSubItem?: MobileSidebarSubSubItemType;
};

export default function DashboardMobileSidebarItem({
  item,
  subItem,
  subSubItem,
}: DashboardMobileSidebarItemProps) {
  const pathname = usePathname();
  const [isItemExpanded, setIsItemExpanded] = useState(false);
  const [isSubItemExpanded, setIsSubItemExpanded] = useState(false);

  const isItemPathActive = item && pathname.includes(item.href);
  const isSubItemPathActive = subItem && pathname.includes(subItem.href);
  const isSubSubItemPathActive =
    subSubItem && pathname.includes(subSubItem.href);

  if (!item && !subItem && !subSubItem) {
    return null;
  }

  const handleToggle = () => {
    if (item && item.subItems && item.subItems.length > 0) {
      setIsItemExpanded(!isItemExpanded);
    } else if (
      subItem &&
      subItem.subSubItems &&
      subItem.subSubItems.length > 0
    ) {
      setIsSubItemExpanded(!isSubItemExpanded);
    }
  };

  return (
    <div
      className={cn("flex w-full flex-col items-start", {
        "[&:not(:last-child)]:border-b": item,
        "pl-4": subItem || subSubItem,
      })}
    >
      <div
        className={cn("flex w-full items-center justify-between pb-2", {
          "cursor-pointer":
            (item && item.subItems && item.subItems.length > 0) ||
            (subItem && subItem.subSubItems && subItem.subSubItems.length > 0),
        })}
        onClick={handleToggle}
      >
        <Button
          className={cn({
            "bg-accent": isItemPathActive,
            "bg-accent/70": isSubItemPathActive,
            "bg-accent/40": isSubSubItemPathActive,
          })}
          variant="ghost"
        >
          {(item && (
            <Link href={item.href} className="flex items-center gap-x-2">
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )) ||
            (subItem && (
              <Link href={subItem.href} className="flex items-center gap-x-2">
                <subItem.icon className="h-4 w-4 shrink-0" />
                {subItem.label}
              </Link>
            )) ||
            (subSubItem && (
              <Link
                href={subSubItem.href}
                className="flex items-center gap-x-2"
              >
                <subSubItem.icon className="h-4 w-4 shrink-0" />
                {subSubItem.label}
              </Link>
            ))}
        </Button>
        {((item && item.subItems && item.subItems.length > 0) ||
          (subItem &&
            subItem.subSubItems &&
            subItem.subSubItems.length > 0)) && (
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 transition", {
              "rotate-180": isItemExpanded || isSubItemExpanded,
            })}
          />
        )}
      </div>
      {item && item.subItems && item.subItems.length > 0 && isItemExpanded && (
        <>
          {item.subItems.map((subItem) => (
            <DashboardMobileSidebarItem key={subItem.href} subItem={subItem} />
          ))}
        </>
      )}
      {subItem &&
        subItem.subSubItems &&
        subItem.subSubItems.length > 0 &&
        isSubItemExpanded && (
          <>
            {subItem.subSubItems.map((subSubItem) => (
              <DashboardMobileSidebarItem
                key={subSubItem.href}
                subSubItem={subSubItem}
              />
            ))}
          </>
        )}
    </div>
  );
}
