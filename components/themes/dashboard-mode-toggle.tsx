"use client";

import { useTheme as useMode } from "next-themes";
import { useMediaQuery } from "usehooks-ts";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";

export default function DashboardModeToggle() {
  const matchesSmMediaQuery = useMediaQuery("(min-width: 640px)");
  const { resolvedTheme: mode, setTheme: setMode } = useMode();

  return (
    <div className="flex flex-col items-center gap-y-4">
      <p className="text-base font-medium">Modes</p>
      <div className="flex gap-x-4">
        {matchesSmMediaQuery ? (
          <>
            <Button
              className={cn("gap-x-2 font-medium", {
                "border-2 border-primary": mode === "light",
              })}
              variant="outline"
              onClick={() => setMode("light")}
            >
              <Sun className="h-5 w-5 shrink-0" />
              <span>Light</span>
            </Button>
            <Button
              className={cn("gap-x-2 font-medium", {
                "border-2 border-primary": mode === "dark",
              })}
              variant="outline"
              onClick={() => setMode("dark")}
            >
              <Moon className="h-5 w-5 shrink-0" />
              <span>Dark</span>
            </Button>
          </>
        ) : (
          <>
            <Hint label="Light" side="bottom" sideOffset={10} asChild>
              <Button
                className={cn("font-medium", {
                  "border-2 border-primary": mode === "light",
                })}
                variant="outline"
                size="icon"
                onClick={() => setMode("light")}
              >
                <Sun className="h-5 w-5 shrink-0" />
              </Button>
            </Hint>
            <Hint label="Dark" side="bottom" sideOffset={10} asChild>
              <Button
                className={cn("font-medium", {
                  "border-2 border-primary": mode === "dark",
                })}
                variant="outline"
                size="icon"
                onClick={() => setMode("dark")}
              >
                <Moon className="h-5 w-5 shrink-0" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
}
