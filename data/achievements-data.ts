import { BookHeart, GraduationCap, Landmark, LucideIcon } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

export type AchievementType = {
  icon: LucideIcon;
  category: Doc<"achievements">["category"];
};

export const achievements: AchievementType[] = [
  {
    icon: GraduationCap,
    category: "Academic",
  },
  {
    icon: BookHeart,
    category: "Professional",
  },
  {
    icon: Landmark,
    category: "Personal",
  },
];
