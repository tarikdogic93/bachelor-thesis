"use client";

import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import { calculateProficiency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type SkillBadgeProps = {
  name: string;
  rating: number;
};

export default function SkillBadge({ name, rating }: SkillBadgeProps) {
  const matchesSmMediaQuery = useMediaQuery("(min-width: 640px)");
  const [isProficiencyVisible, setIsProficiencyVisible] = useState(false);

  return (
    <>
      {matchesSmMediaQuery ? (
        <Badge
          className="flex cursor-pointer items-center gap-x-2"
          variant="secondary"
          onClick={() => setIsProficiencyVisible(!isProficiencyVisible)}
        >
          <span className="max-w-44 truncate">{name}</span>
          {isProficiencyVisible && (
            <>
              <Separator
                className="h-4 bg-secondary-foreground"
                orientation="vertical"
              />
              <span>{calculateProficiency(rating)}</span>
            </>
          )}
        </Badge>
      ) : (
        <div className="flex flex-col items-center gap-y-1">
          <Badge variant="secondary">
            <span className="max-w-52 truncate">{name}</span>
          </Badge>
          <Badge className="w-fit" variant="outline">
            <span>{calculateProficiency(rating)}</span>
          </Badge>
        </div>
      )}
    </>
  );
}
