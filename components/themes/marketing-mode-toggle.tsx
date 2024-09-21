"use client";

import { useTheme as useMode } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MarketingModeToggle() {
  const { resolvedTheme: resolvedMode, setTheme: setMode } = useMode();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] shrink-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] shrink-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Mode toggle</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-1" align="end">
        <DropdownMenuItem
          className={cn("cursor-pointer", {
            "bg-muted": resolvedMode === "light",
          })}
          onClick={() => setMode("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn("cursor-pointer", {
            "bg-muted": resolvedMode === "dark",
          })}
          onClick={() => setMode("dark")}
        >
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
