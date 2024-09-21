"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { NavbarItemType } from "@/data/navbar-data";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type DashboardNavbarItemProps = {
  item: NavbarItemType;
};

export default function DashboardNavbarItem({
  item,
}: DashboardNavbarItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  let isPathActive = pathname.includes(item.href);

  return (
    <NavigationMenuItem key={item.href}>
      {item.subItems && item.subItems.length > 0 ? (
        <>
          <NavigationMenuTrigger
            className={cn({
              "bg-accent text-accent-foreground": isPathActive,
            })}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="ml-2">{item.label}</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] grid-cols-2 gap-3 p-4">
              {item.subItems.map((subItem) => {
                isPathActive = pathname.includes(subItem.href);

                return (
                  <li key={subItem.href}>
                    <Link href={subItem.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "h-full w-full justify-start",
                        )}
                        active={isPathActive}
                      >
                        <div className="flex flex-col gap-y-1">
                          <div className="flex items-center gap-x-2">
                            <subItem.icon className="h-4 w-4 shrink-0" />
                            <span className="text-sm font-medium leading-none">
                              {subItem.label}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {subItem.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </>
      ) : (
        <Link href={item.href} legacyBehavior passHref>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            active={isPathActive}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="ml-2">{item.label}</span>
          </NavigationMenuLink>
        </Link>
      )}
    </NavigationMenuItem>
  );
}
