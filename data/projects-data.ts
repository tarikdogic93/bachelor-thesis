import {
  AppWindow,
  Bot,
  Cloudy,
  Database,
  GalleryThumbnails,
  Gamepad2,
  Infinity,
  LucideIcon,
  Monitor,
  ShoppingCart,
  Smartphone,
} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

export type ProjectType = {
  icon: LucideIcon;
  category: Doc<"projects">["category"];
};

export const projects: ProjectType[] = [
  {
    icon: AppWindow,
    category: "Web development",
  },
  {
    icon: Smartphone,
    category: "Mobile app development",
  },
  {
    icon: Monitor,
    category: "Desktop app development",
  },
  {
    icon: Gamepad2,
    category: "Game development",
  },
  {
    icon: Database,
    category: "Database management system",
  },
  {
    icon: GalleryThumbnails,
    category: "Content management system",
  },
  {
    icon: ShoppingCart,
    category: "E-commerce platform development",
  },
  {
    icon: Bot,
    category: "Artificial intelligence",
  },
  {
    icon: Infinity,
    category: "DevOps tools",
  },
  {
    icon: Cloudy,
    category: "Cloud computing",
  },
];
