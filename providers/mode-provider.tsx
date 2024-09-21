"use client";

import { ThemeProvider as NextModesProvider } from "next-themes";
import { type ThemeProviderProps as ModeProviderProps } from "next-themes/dist/types";
import * as React from "react";

export default function ModeProvider({
  children,
  ...props
}: ModeProviderProps) {
  return <NextModesProvider {...props}>{children}</NextModesProvider>;
}
