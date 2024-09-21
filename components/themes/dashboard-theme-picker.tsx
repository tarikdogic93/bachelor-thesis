"use client";

import { useEffect, useState } from "react";

import { capitalizeFirstLetter, cn, handleThemeChange } from "@/lib/utils";
import { themes } from "@/data/themes-data";
import { useThemeStore } from "@/stores/use-theme-store";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function DashboardThemePicker() {
  const { theme: resolvedTheme, setTheme } = useThemeStore();
  const [hoveredTheme, setHoveredTheme] = useState<string>("");
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const index = themes.findIndex((theme) => theme === resolvedTheme);

    if (index !== -1) {
      api.scrollTo(index - 2);
    }
  }, [api, resolvedTheme]);

  function handleMouseEnter(theme: string) {
    setHoveredTheme(theme);
  }

  function handleMouseLeave() {
    setHoveredTheme("");
  }

  return (
    <div className="flex flex-col items-center gap-y-4">
      <p className="text-base font-medium">Themes</p>
      <Carousel
        className={cn("w-full max-w-48 sm:max-w-lg")}
        opts={{
          align: "start",
        }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-1">
          {themes.map((theme, index) => (
            <CarouselItem
              key={index}
              className={cn("basis-1/3 pl-2 sm:basis-1/5")}
            >
              <Button
                key={`theme-${theme}`}
                className="w-full font-medium text-black hover:text-black dark:text-white dark:hover:text-white"
                style={{
                  backgroundColor:
                    hoveredTheme === theme || resolvedTheme === theme
                      ? `var(--${theme}-500)`
                      : "",
                  borderColor: `var(--${theme}-500)`,
                }}
                variant="outline"
                onClick={() => handleThemeChange(theme, setTheme)}
                onMouseEnter={() => handleMouseEnter(theme)}
                onMouseLeave={handleMouseLeave}
              >
                {capitalizeFirstLetter(theme)}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
