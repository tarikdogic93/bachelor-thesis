"use client";

import { ReactNode, useEffect } from "react";

import { addThemeClass } from "@/lib/utils";
import { useThemeStore } from "@/stores/use-theme-store";

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme: resolvedTheme } = useThemeStore();

  useEffect(() => {
    addThemeClass(resolvedTheme);
  }, [resolvedTheme]);

  return <>{children}</>;
}
