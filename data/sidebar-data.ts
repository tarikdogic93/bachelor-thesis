import {
  AtSign,
  Contact,
  LineChart,
  LucideIcon,
  Settings,
  Table2,
  Trophy,
  Zap,
} from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";

export type SidebarItemType = {
  label: string;
  href: string;
  icon: LucideIcon;
  special?: boolean;
};

export type SidebarRouteType = {
  role: Exclude<Doc<"users">["role"], undefined>;
  items: SidebarItemType[];
};

export const sidebarRoutes: SidebarRouteType[] = [
  {
    role: "Applicant",
    items: [
      {
        label: "Profile",
        href: "/dashboard/profile",
        icon: Zap,
      },
      {
        label: "Jobs",
        href: "/dashboard/jobs",
        icon: Trophy,
      },
      {
        label: "Forum",
        href: "/dashboard/forum",
        icon: Contact,
      },
      {
        label: "Chat",
        href: "/dashboard/chat",
        icon: AtSign,
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
  {
    role: "Company",
    items: [
      {
        label: "Profile",
        href: "/dashboard/profile",
        icon: Zap,
      },
      {
        label: "Jobs",
        href: "/dashboard/jobs",
        icon: Trophy,
      },
      {
        label: "Forum",
        href: "/dashboard/forum",
        icon: Contact,
      },
      {
        label: "Chat",
        href: "/dashboard/chat",
        icon: AtSign,
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
  {
    role: "Admin",
    items: [
      {
        label: "Profile",
        href: "/dashboard/profile",
        icon: Zap,
      },
      {
        label: "Management",
        href: "/dashboard/management",
        icon: Table2,
      },
      {
        label: "Analytics",
        href: "/dashboard/analytics",
        icon: LineChart,
      },
      {
        label: "Jobs",
        href: "/dashboard/jobs",
        icon: Trophy,
      },
      {
        label: "Forum",
        href: "/dashboard/forum",
        icon: Contact,
      },
      {
        label: "Chat",
        href: "/dashboard/chat",
        icon: AtSign,
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
