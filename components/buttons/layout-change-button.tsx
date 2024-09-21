"use client";

import { LucideIcon, PanelLeft, PanelRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { PositionType, useLayoutStore } from "@/stores/use-layout-store";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";

type LayoutsType = {
  position: PositionType;
  content: string;
  icon: LucideIcon;
}[];

const layouts: LayoutsType = [
  {
    position: "left",
    content: "Sidebar on the left",
    icon: PanelLeft,
  },
  {
    position: "right",
    content: "Sidebar on the right",
    icon: PanelRight,
  },
];

type LayoutChangeProps = {
  position: PositionType;
};

export default function LayoutChangeButton({ position }: LayoutChangeProps) {
  const { position: resolvedPosition, setPosition } = useLayoutStore();

  const layout = position === "left" ? layouts[0] : layouts[1];

  return (
    <Hint
      side="bottom"
      align={position === "left" ? "end" : "start"}
      sideOffset={10}
      label={position === "left" ? layout.content : layout.content}
      asChild
    >
      <Button
        className={cn("h-20 w-20", {
          "border-2 border-primary": layout.position === resolvedPosition,
        })}
        variant="outline"
        size="icon"
        onClick={() => setPosition(position)}
      >
        {position === "left" ? <layout.icon /> : <layout.icon />}
      </Button>
    </Hint>
  );
}
