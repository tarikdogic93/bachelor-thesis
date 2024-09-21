"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type HintProps = {
  className?: string;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  label: string | number;
  asChild?: boolean;
  children: React.ReactNode;
};

export default function Hint({
  className,
  delayDuration = 0,
  side,
  sideOffset,
  align,
  label,
  asChild,
  children,
}: HintProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent
          className={cn(className)}
          side={side}
          sideOffset={sideOffset}
          align={align}
        >
          <p className="max-w-44 truncate font-semibold sm:max-w-full">
            {label}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
