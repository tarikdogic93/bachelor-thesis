import {
  Backpack,
  BriefcaseBusiness,
  CircleDollarSign,
  Coins,
  HelpingHand,
  LucideIcon,
  Microscope,
  School,
  Scroll,
  Swords,
} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

export type ExperienceType = {
  icon: LucideIcon;
  category: Doc<"experiences">["category"];
};

export const experiences: ExperienceType[] = [
  {
    icon: School,
    category: "Education",
  },
  {
    icon: Scroll,
    category: "Certification",
  },
  {
    icon: Swords,
    category: "Competition",
  },
  {
    icon: Backpack,
    category: "Internship",
  },
  {
    icon: HelpingHand,
    category: "Volunteer",
  },
  {
    icon: Coins,
    category: "Freelance",
  },
  {
    icon: CircleDollarSign,
    category: "Work",
  },
  {
    icon: Microscope,
    category: "Research",
  },
  {
    icon: BriefcaseBusiness,
    category: "Entrepreneurial",
  },
];
