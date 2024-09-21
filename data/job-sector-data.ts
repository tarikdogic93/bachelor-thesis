import {
  AppWindow,
  Bot,
  Cloudy,
  Infinity,
  LucideIcon,
  Shuffle,
  Smartphone,
} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

export type JobSectorType = {
  icon: LucideIcon;
  category: Doc<"jobs">["jobSector"];
};

export const jobSectors: JobSectorType[] = [
  {
    icon: AppWindow,
    category: "Web development",
  },
  {
    icon: Smartphone,
    category: "Mobile development",
  },
  {
    icon: Bot,
    category: "Artificial intelligence",
  },
  {
    icon: Infinity,
    category: "DevOps engineering",
  },
  {
    icon: Cloudy,
    category: "Cloud computing",
  },
  {
    icon: Shuffle,
    category: "Other",
  },
];
