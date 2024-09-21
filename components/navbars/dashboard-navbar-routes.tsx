"use client";

import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

import { navbarRoutes } from "@/data/navbar-data";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import DashboardNavbarItem from "@/components/navbars/dashboard-navbar-item";

export default function DashboardNavbarRoutes() {
  const { isLoaded, isSignedIn, user } = useUser();
  const pathname = usePathname();
  const navigationMenuListRef =
    useRef<ElementRef<typeof NavigationMenuPrimitive.List>>(null);
  const [navigationMenuListWidth, setNavigationMenuListWidth] = useState(0);

  useEffect(() => {
    if (navigationMenuListRef.current) {
      setNavigationMenuListWidth(navigationMenuListRef.current.offsetWidth);
    }
  }, [pathname]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const items = navbarRoutes
    .find((route) => route.role === user.publicMetadata["role"])
    ?.items.filter((item) => pathname.includes(item.baseHref));

  return (
    <NavigationMenu className="z-20">
      <NavigationMenuList ref={navigationMenuListRef}>
        {user &&
          items?.map((item) => (
            <DashboardNavbarItem key={item.href} item={item} />
          ))}
      </NavigationMenuList>
      <NavigationMenuViewport
        className="mt-4"
        style={{
          left: `calc(0.5 * (${navigationMenuListWidth}px - var(--radix-navigation-menu-viewport-width)))`,
        }}
      />
    </NavigationMenu>
  );
}
