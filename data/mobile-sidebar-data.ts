import {
  AtSign,
  Award,
  Axis3D,
  Building,
  Cake,
  Calendar,
  Contact,
  Contact2,
  Crown,
  Dna,
  Earth,
  Flag,
  GraduationCap,
  Languages,
  Layout,
  LineChart,
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
  Settings,
  Settings2,
  Sprout,
  Table2,
  TrendingUp,
  Trophy,
  User2,
  Users,
  Zap,
} from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";

export type MobileSidebarSubSubItemType = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type MobileSidebarSubItemType = {
  href: string;
  label: string;
  icon: LucideIcon;
  subSubItems?: MobileSidebarSubSubItemType[];
};

export type MobileSidebarItemType = {
  label: string;
  href: string;
  icon: LucideIcon;
  special?: boolean;
  subItems?: MobileSidebarSubItemType[];
};

export type MobileSidebarRouteType = {
  role: Exclude<Doc<"users">["role"], undefined>;
  items: MobileSidebarItemType[];
};

export const mobileSidebarRoutes: MobileSidebarRouteType[] = [
  {
    role: "Applicant",
    items: [
      {
        label: "Profile",
        href: "/dashboard/profile",
        icon: Zap,
        subItems: [
          {
            href: "/dashboard/profile/personal-info",
            label: "Personal info",
            icon: Contact2,
          },
          {
            href: "/dashboard/profile/skills",
            label: "Skills",
            icon: Sprout,
          },
          {
            href: "/dashboard/profile/achievements",
            label: "Achievements",
            icon: Award,
          },
          {
            href: "/dashboard/profile/experiences",
            label: "Experiences",
            icon: Flag,
          },
        ],
      },
      {
        label: "Jobs",
        href: "/dashboard/jobs",
        icon: Trophy,
        subItems: [
          {
            href: "/dashboard/jobs/listings",
            label: "Listings",
            icon: List,
          },
        ],
      },
      {
        label: "Forum",
        href: "/dashboard/forum",
        icon: Contact,
        subItems: [
          {
            href: "/dashboard/forum/threads",
            label: "Threads",
            icon: Route,
          },
          {
            href: "/dashboard/forum/posts",
            label: "Posts",
            icon: ListTree,
          },
          {
            href: "/dashboard/forum/comments",
            label: "Comments",
            icon: MessageCircle,
          },
        ],
      },
      {
        label: "Chat",
        href: "/dashboard/chat",
        icon: AtSign,
        subItems: [
          {
            href: "/dashboard/chat/applicants",
            label: "Applicants",
            icon: PersonStanding,
          },
          {
            href: "/dashboard/chat/companies",
            label: "Companies",
            icon: Building,
          },
          {
            href: "/dashboard/chat/conversations",
            label: "Conversations",
            icon: MessageSquare,
          },
        ],
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        subItems: [
          {
            href: "/dashboard/settings/account",
            label: "Account",
            icon: User2,
          },
          {
            href: "/dashboard/settings/preferences",
            label: "Preferences",
            icon: Settings2,
          },
          {
            href: "/dashboard/settings/layout",
            label: "Layout",
            icon: Layout,
          },
          {
            href: "/dashboard/settings/style",
            label: "Style",
            icon: Palette,
          },
        ],
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
        subItems: [
          {
            href: "/dashboard/profile/personal-info",
            label: "Personal info",
            icon: Contact2,
          },
          {
            href: "/dashboard/profile/projects",
            label: "Projects",
            icon: Presentation,
          },
        ],
      },
      {
        label: "Jobs",
        href: "/dashboard/jobs",
        icon: Trophy,
        subItems: [
          {
            href: "/dashboard/jobs/listings",
            label: "Listings",
            icon: List,
          },
          {
            href: "/dashboard/jobs/applicants",
            label: "Applicants",
            icon: PersonStanding,
          },
        ],
      },
      {
        label: "Forum",
        href: "/dashboard/forum",
        icon: Contact,
        subItems: [
          {
            href: "/dashboard/forum/threads",
            label: "Threads",
            icon: Route,
          },
          {
            href: "/dashboard/forum/posts",
            label: "Posts",
            icon: ListTree,
          },
          {
            href: "/dashboard/forum/comments",
            label: "Comments",
            icon: MessageCircle,
          },
        ],
      },
      {
        label: "Chat",
        href: "/dashboard/chat",
        icon: AtSign,
        subItems: [
          {
            href: "/dashboard/chat/applicants",
            label: "Applicants",
            icon: PersonStanding,
          },
          {
            href: "/dashboard/chat/companies",
            label: "Companies",
            icon: Building,
          },
          {
            href: "/dashboard/chat/conversations",
            label: "Conversations",
            icon: MessageSquare,
          },
        ],
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        subItems: [
          {
            href: "/dashboard/settings/account",
            label: "Account",
            icon: User2,
          },
          {
            href: "/dashboard/settings/preferences",
            label: "Preferences",
            icon: Settings2,
          },
          {
            href: "/dashboard/settings/layout",
            label: "Layout",
            icon: Layout,
          },
          {
            href: "/dashboard/settings/style",
            label: "Style",
            icon: Palette,
          },
        ],
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
        subItems: [
          {
            href: "/dashboard/profile/personal-info",
            label: "Personal info",
            icon: Contact2,
          },
        ],
      },
      {
        label: "Management",
        href: "/dashboard/management",
        icon: Table2,
        subItems: [
          {
            href: "/dashboard/management/applicants",
            label: "Applicants",
            icon: PersonStanding,
          },
          {
            href: "/dashboard/management/companies",
            label: "Companies",
            icon: Building,
          },
        ],
      },
      {
        label: "Analytics",
        href: "/dashboard/analytics",
        icon: LineChart,
        subItems: [
          {
            href: "/dashboard/analytics/applicants",
            label: "Applicants",
            icon: PersonStanding,
            subSubItems: [
              {
                href: "/dashboard/analytics/applicants/gender",
                label: "Gender",
                icon: Dna,
              },
              {
                href: "/dashboard/analytics/applicants/age",
                label: "Age",
                icon: Cake,
              },
              {
                href: "/dashboard/analytics/applicants/language",
                label: "Language",
                icon: Languages,
              },
              {
                href: "/dashboard/analytics/applicants/country",
                label: "Country",
                icon: Earth,
              },
            ],
          },
          {
            href: "/dashboard/analytics/companies",
            label: "Companies",
            icon: Building,
            subSubItems: [
              {
                href: "/dashboard/analytics/companies/establishment",
                label: "Establishment",
                icon: Calendar,
              },
              {
                href: "/dashboard/analytics/companies/employees",
                label: "Employees",
                icon: Users,
              },
              {
                href: "/dashboard/analytics/companies/country",
                label: "Country",
                icon: Earth,
              },
              {
                href: "/dashboard/analytics/companies/projects",
                label: "Projects",
                icon: Presentation,
              },
            ],
          },
          {
            href: "/dashboard/analytics/listings",
            label: "Listings",
            icon: List,
            subSubItems: [
              {
                href: "/dashboard/analytics/listings/job-type",
                label: "Job type",
                icon: ScrollText,
              },
              {
                href: "/dashboard/analytics/listings/setting-type",
                label: "Setting type",
                icon: Axis3D,
              },
              {
                href: "/dashboard/analytics/listings/education-level",
                label: "Education level",
                icon: GraduationCap,
              },
              {
                href: "/dashboard/analytics/listings/experience-level",
                label: "Experience level",
                icon: TrendingUp,
              },
            ],
          },
        ],
      },
      {
        label: "Jobs",
        href: "/dashboard/jobs",
        icon: Trophy,
        subItems: [
          {
            href: "/dashboard/jobs/listings",
            label: "Listings",
            icon: List,
          },
          {
            href: "/dashboard/jobs/applicants",
            label: "Applicants",
            icon: PersonStanding,
          },
        ],
      },
      {
        label: "Forum",
        href: "/dashboard/forum",
        icon: Contact,
        subItems: [
          {
            href: "/dashboard/forum/threads",
            label: "Threads",
            icon: Route,
          },
          {
            href: "/dashboard/forum/posts",
            label: "Posts",
            icon: ListTree,
          },
          {
            href: "/dashboard/forum/comments",
            label: "Comments",
            icon: MessageCircle,
          },
        ],
      },
      {
        label: "Chat",
        href: "/dashboard/chat",
        icon: AtSign,
        subItems: [
          {
            href: "/dashboard/chat/admins",
            label: "Admins",
            icon: Crown,
          },
          {
            href: "/dashboard/chat/conversations",
            label: "Conversations",
            icon: MessageSquare,
          },
        ],
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        subItems: [
          {
            href: "/dashboard/settings/account",
            label: "Account",
            icon: User2,
          },
          {
            href: "/dashboard/settings/preferences",
            label: "Preferences",
            icon: Settings2,
          },
          {
            href: "/dashboard/settings/layout",
            label: "Layout",
            icon: Layout,
          },
          {
            href: "/dashboard/settings/style",
            label: "Style",
            icon: Palette,
          },
        ],
      },
    ],
  },
];
