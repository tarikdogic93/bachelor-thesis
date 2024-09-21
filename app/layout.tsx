import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site-config-data";
import ConvexWithClerkProvider from "@/providers/convex-with-clerk-provider";
import ModeProvider from "@/providers/mode-provider";
import ThemeProvider from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTopButton from "@/components/buttons/scroll-to-top-button";

const font = localFont({
  src: [
    {
      path: "../public/fonts/barlow/barlow-thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/barlow/barlow-thin-italic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/fonts/barlow/barlow-extra-light.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/barlow/barlow-extra-light-italic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/fonts/barlow/barlow-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/barlow/barlow-light-italic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/barlow/barlow-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/barlow/barlow-regular-italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/barlow/barlow-medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/barlow/barlow-medium-italic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/barlow/barlow-semi-bold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/barlow/barlow-semi-bold-italic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/barlow/barlow-bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/barlow/barlow-bold-italic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/barlow/barlow-extra-bold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/barlow/barlow-extra-bold-italic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/fonts/barlow/barlow-black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/barlow/barlow-black-italic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--custom-font",
});

type LayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `${siteConfig.title} - %s`,
  },
  description: siteConfig.description,
  icons: siteConfig.icons,
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("custom-scrollbar", font.variable)}>
        <ModeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="mode"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider>
            <ConvexWithClerkProvider>{children}</ConvexWithClerkProvider>
            <ScrollToTopButton />
            <Toaster theme="light" position="bottom-right" />
          </ThemeProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
