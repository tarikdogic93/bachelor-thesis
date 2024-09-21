"use client";

import { Brush } from "lucide-react";

import { handleThemeChange } from "@/lib/utils";
import { themes } from "@/data/themes-data";
import { useThemeStore } from "@/stores/use-theme-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MarketingThemePicker() {
  const { theme: resolvedTheme, setTheme } = useThemeStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Brush className="h-[1.2rem] w-[1.2rem] shrink-0" />
          <span className="sr-only">Theme picker</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid grid-cols-5 gap-2 p-2" align="end">
        {themes.map((theme) => {
          const isActiveTheme = resolvedTheme === theme;

          return (
            <DropdownMenuItem
              key={`theme-${theme}`}
              className="cursor-pointer p-3 transition hover:brightness-90 dark:hover:brightness-125"
              style={{
                backgroundColor: `var(--${theme}-500)`,
                outlineColor: isActiveTheme ? `var(--${theme}-500)` : undefined,
                outlineOffset: isActiveTheme ? 2 : undefined,
              }}
              onClick={() => handleThemeChange(theme, setTheme)}
            />
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
