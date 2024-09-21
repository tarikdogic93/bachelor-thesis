"use client";

import Link from "next/link";
import { LucideIcon, Pencil, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { FocusFieldType, useModalStore } from "@/stores/use-modal-store";
import Hint from "@/components/ui/hint";

type PersonalInfoItemProps = {
  icon: LucideIcon;
  hintLabel: string;
  label: string | number;
  user: Doc<"users">;
  disableEdit?: boolean;
  addMissingData?: boolean;
  focusField?: FocusFieldType;
  isLink?: boolean;
  href?: string;
  viewOnly?: boolean;
};

export default function PersonalInfoItem({
  icon: Icon,
  hintLabel,
  label,
  user,
  disableEdit,
  addMissingData,
  focusField,
  isLink,
  href,
  viewOnly,
}: PersonalInfoItemProps) {
  const { handleOpen } = useModalStore();

  return (
    <div className="group flex w-full items-center gap-x-2">
      <div className="flex items-center gap-x-4">
        <Hint side="left" sideOffset={10} label={hintLabel}>
          <div className="rounded-md bg-from/80 p-2 text-white group-hover:bg-from">
            <Icon className="h-5 w-5" />
          </div>
        </Hint>
        {isLink && href ? (
          <Link
            className={cn(
              "underline-animation relative max-w-48 truncate font-medium",
              {
                "max-w-52 sm:max-w-96": !!viewOnly,
              },
            )}
            href={href}
            target="_blank"
          >
            {label}
          </Link>
        ) : (
          <p
            className={cn("max-w-48 truncate font-medium", {
              "max-w-52 sm:max-w-96": !!viewOnly,
            })}
          >
            {label}
          </p>
        )}
      </div>
      {addMissingData && (
        <PlusCircle
          className="h-5 w-5 shrink-0 cursor-pointer"
          onClick={() => handleOpen("managePersonalInfo", { user }, focusField)}
        />
      )}
      {!disableEdit && !addMissingData && (
        <div
          className="hidden cursor-pointer group-hover:block"
          onClick={() => handleOpen("managePersonalInfo", { user }, focusField)}
        >
          <Pencil className="h-4 w-4 shrink-0" />
        </div>
      )}
    </div>
  );
}
