import {
  Award,
  Axis3D,
  Building,
  Cake,
  Calendar,
  Contact2,
  Crown,
  Dna,
  Earth,
  Flag,
  GraduationCap,
  Languages,
  Layout,
  List,
  ListTree,
  LucideIcon,
  MessageCircle,
  MessageSquare,
  Palette,
  PersonStanding,
  Presentation,
  Route,
  ScrollText,
  Settings2,
  Sprout,
  TrendingUp,
  User2,
  Users,
} from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";

export type NavbarSubItemType = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

export type NavbarItemType = {
  baseHref: string;
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavbarSubItemType[];
};

export type NavbarRouteType = {
  role: Exclude<Doc<"users">["role"], undefined>;
  items: NavbarItemType[];
};

export const navbarRoutes: NavbarRouteType[] = [
  {
    role: "Applicant",
    items: [
      {
        baseHref: "/dashboard/profile",
        href: "/dashboard/profile/personal-info",
        label: "Personal info",
        icon: Contact2,
      },
      {
        baseHref: "/dashboard/profile",
        href: "/dashboard/profile/skills",
        label: "Skills",
        icon: Sprout,
      },
      {
        baseHref: "/dashboard/profile",
        href: "/dashboard/profile/achievements",
        label: "Achievements",
        icon: Award,
      },
      {
        baseHref: "/dashboard/profile",
        href: "/dashboard/profile/experiences",
        label: "Experiences",
        icon: Flag,
      },
      {
        baseHref: "/dashboard/jobs",
        href: "/dashboard/jobs/listings",
        label: "Listings",
        icon: List,
      },
      {
        baseHref: "/dashboard/forum",
        href: "/dashboard/forum/threads",
        label: "Threads",
        icon: Route,
      },
      {
        baseHref: "/dashboard/forum",
        href: "/dashboard/forum/posts",
        label: "Posts",
        icon: ListTree,
      },
      {
        baseHref: "/dashboard/forum",
        href: "/dashboard/forum/comments",
        label: "Comments",
        icon: MessageCircle,
      },
      {
        baseHref: "/dashboard/chat",
        href: "/dashboard/chat/applicants",
        label: "Applicants",
        icon: PersonStanding,
      },
      {
        baseHref: "/dashboard/chat",
        href: "/dashboard/chat/companies",
        label: "Companies",
        icon: Building,
      },
      {
        baseHref: "/dashboard/chat",
        href: "/dashboard/chat/conversations",
        label: "Conversations",
        icon: MessageSquare,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/account",
        label: "Account",
        icon: User2,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/preferences",
        label: "Preferences",
        icon: Settings2,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/layout",
        label: "Layout",
        icon: Layout,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/style",
        label: "Style",
        icon: Palette,
      },
    ],
  },
  {
    role: "Company",
    items: [
      {
        baseHref: "/dashboard/profile",
        href: "/dashboard/profile/personal-info",
        label: "Personal info",
        icon: Contact2,
      },
      {
        baseHref: "/dashboard/profile",
        href: "/dashboard/profile/projects",
        label: "Projects",
        icon: Presentation,
      },
      {
        baseHref: "/dashboard/jobs",
        href: "/dashboard/jobs/listings",
        label: "Listings",
        icon: List,
      },
      {
        baseHref: "/dashboard/jobs",
        href: "/dashboard/jobs/applicants",
        label: "Applicants",
        icon: PersonStanding,
      },
      {
        baseHref: "/dashboard/forum",
        href: "/dashboard/forum/threads",
        label: "Threads",
        icon: Route,
      },
      {
        baseHref: "/dashboard/forum",
        href: "/dashboard/forum/posts",
        label: "Posts",
        icon: ListTree,
      },
      {
        baseHref: "/dashboard/forum",
        href: "/dashboard/forum/comments",
        label: "Comments",
        icon: MessageCircle,
      },
      {
        baseHref: "/dashboard/chat",
        href: "/dashboard/chat/applicants",
        label: "Applicants",
        icon: PersonStanding,
      },
      {
        baseHref: "/dashboard/chat",
        href: "/dashboard/chat/companies",
        label: "Companies",
        icon: Building,
      },
      {
        baseHref: "/dashboard/chat",
        href: "/dashboard/chat/conversations",
        label: "Conversations",
        icon: MessageSquare,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/account",
        label: "Account",
        icon: User2,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/preferences",
        label: "Preferences",
        icon: Settings2,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/layout",
        label: "Layout",
        icon: Layout,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/style",
        label: "Style",
        icon: Palette,
      },
    ],
  },
  {
    role: "Admin",
    items: [
      {
        baseHref: "/dashboard/profile",
        href: "/dashboard/profile/personal-info",
        label: "Personal info",
        icon: Contact2,
      },
      {
        baseHref: "/dashboard/management",
        href: "/dashboard/management/applicants",
        label: "Applicants",
        icon: PersonStanding,
      },
      {
        baseHref: "/dashboard/management",
        href: "/dashboard/management/companies",
        label: "Companies",
        icon: Building,
      },
      {
        baseHref: "/dashboard/analytics",
        href: "/dashboard/analytics/applicants",
        label: "Applicants",
        icon: PersonStanding,
        subItems: [
          {
            href: "/dashboard/analytics/applicants/gender",
            label: "Gender",
            icon: Dna,
            description:
              "Analyze gender representation to ensure equitable practices",
          },
          {
            href: "/dashboard/analytics/applicants/age",
            label: "Age",
            icon: Cake,
            description:
              "Explore age demographics to understand population dynamics",
          },
          {
            href: "/dashboard/analytics/applicants/language",
            label: "Language",
            icon: Languages,
            description:
              "Assess language proficiency to better tailor communication strategies",
          },
          {
            href: "/dashboard/analytics/applicants/country",
            label: "Country",
            icon: Earth,
            description:
              "Investigate geographic distribution to gain perspective on origin trends",
          },
        ],
      },
      {
        baseHref: "/dashboard/analytics",
        href: "/dashboard/analytics/companies",
        label: "Companies",
        icon: Building,
        subItems: [
          {
            href: "/dashboard/analytics/companies/establishment",
            label: "Establishment",
            icon: Calendar,
            description:
              "Examine companies establishment year to track growth patterns",
          },
          {
            href: "/dashboard/analytics/companies/employees",
            label: "Employees",
            icon: Users,
            description:
              "Understand company workforce composition for strategic planning",
          },
          {
            href: "/dashboard/analytics/companies/country",
            label: "Country",
            icon: Earth,
            description:
              "Investigate geographic distribution to gain perspective on origin trends",
          },
          {
            href: "/dashboard/analytics/companies/projects",
            label: "Projects",
            icon: Presentation,
            description:
              "Explore the spread of projects across various categories",
          },
        ],
      },
      {
        baseHref: "/dashboard/analytics",
        href: "/dashboard/analytics/listings",
        label: "Listings",
        icon: List,
        subItems: [
          {
            href: "/dashboard/analytics/listings/job-type",
            label: "Job type",
            icon: ScrollText,
            description:
              "Identify which types of job contracts are dominating the market",
          },
          {
            href: "/dashboard/analytics/listings/setting-type",
            label: "Setting type",
            icon: Axis3D,
            description: "Uncover which work settings are currently trending",
          },
          {
            href: "/dashboard/analytics/listings/education-level",
            label: "Education level",
            icon: GraduationCap,
            description:
              "Reveal the educational benchmarks employers are seeking",
          },
          {
            href: "/dashboard/analytics/listings/experience-level",
            label: "Experience level",
            icon: TrendingUp,
            description: "Gauge the demand for various experience levels",
          },
        ],
      },
      {
        baseHref: "/dashboard/jobs",
        href: "/dashboard/jobs/listings",
        label: "Listings",
        icon: List,
      },
      {
        baseHref: "/dashboard/jobs",
        href: "/dashboard/jobs/applicants",
        label: "Applicants",
        icon: PersonStanding,
      },
      {
        baseHref: "/dashboard/forum",
        href: "/dashboard/forum/threads",
        label: "Threads",
        icon: Route,
      },
      {
        baseHref: "/dashboard/forum",
        href: "/dashboard/forum/posts",
        label: "Posts",
        icon: ListTree,
      },
      {
        baseHref: "/dashboard/forum",
        href: "/dashboard/forum/comments",
        label: "Comments",
        icon: MessageCircle,
      },
      {
        baseHref: "/dashboard/chat",
        href: "/dashboard/chat/admins",
        label: "Admins",
        icon: Crown,
      },
      {
        baseHref: "/dashboard/chat",
        href: "/dashboard/chat/conversations",
        label: "Conversations",
        icon: MessageSquare,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/account",
        label: "Account",
        icon: User2,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/preferences",
        label: "Preferences",
        icon: Settings2,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/layout",
        label: "Layout",
        icon: Layout,
      },
      {
        baseHref: "/dashboard/settings",
        href: "/dashboard/settings/style",
        label: "Style",
        icon: Palette,
      },
    ],
  },
];
