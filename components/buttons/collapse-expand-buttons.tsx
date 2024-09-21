"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { PositionType, useLayoutStore } from "@/stores/use-layout-store";
import { SidebarStatusType, useSidebarStore } from "@/stores/use-sidebar-store";
import { Button } from "@/components/ui/button";

export default function CollapseExpandButtons() {
  const { position } = useLayoutStore();
  const { status, handleCollapse, handleExpand } = useSidebarStore();

  const getIcons = (position: PositionType, status: SidebarStatusType) => {
    switch (status) {
      case "fully-open":
        return position === "left"
          ? [{ icon: ChevronsLeft, onClick: handleCollapse }]
          : [{ icon: ChevronsRight, onClick: handleCollapse }];
      case "semi-open":
        return position === "left"
          ? [
              { icon: ChevronLeft, onClick: handleCollapse },
              { icon: ChevronRight, onClick: handleExpand },
            ]
          : [
              { icon: ChevronLeft, onClick: handleExpand },
              { icon: ChevronRight, onClick: handleCollapse },
            ];
      case "closed":
        return position === "left"
          ? [{ icon: ChevronsRight, onClick: handleExpand }]
          : [{ icon: ChevronsLeft, onClick: handleExpand }];
      default:
        return null;
    }
  };

  const icons = getIcons(position, status);

  return (
    <div className="flex items-center gap-x-2">
      {icons &&
        icons.map((item, index) => (
          <Button
            key={`collapse-button-${index}`}
            className="h-6 w-6"
            size="icon"
            onClick={item.onClick}
          >
            <item.icon className="h-5 w-5 shrink-0" />
          </Button>
        ))}
    </div>
  );
}
