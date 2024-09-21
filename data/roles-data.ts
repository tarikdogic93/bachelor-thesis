import { Building, Crown, LucideIcon, PersonStanding } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

export type RoleType = {
  label: string;
  value: Exclude<Doc<"users">["role"], undefined>;
  icon: LucideIcon;
};

export const roles: RoleType[] = [
  {
    label: "Applicant",
    value: "Applicant",
    icon: PersonStanding,
  },
  {
    label: "Company",
    value: "Company",
    icon: Building,
  },
  {
    label: "Admin",
    value: "Admin",
    icon: Crown,
  },
];
