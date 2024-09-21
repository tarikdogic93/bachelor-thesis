"use client";

import { useState } from "react";
import { HeartHandshake } from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";

type AchievementDetailsProps = {
  achievement: Doc<"achievements">;
};

const defaultValue = {
  affiliatedWith: false,
};

export default function AchievementDetails({
  achievement,
}: AchievementDetailsProps) {
  const [areTextsVisible, setAreTextsVisible] = useState(defaultValue);

  return (
    <div className="grid grid-cols-4 gap-3 rounded-md border p-6">
      <h3 className="col-span-full truncate font-medium">
        {achievement.title}
      </h3>
      {achievement.description && (
        <p className="col-span-full text-sm text-muted-foreground">
          {achievement.description}
        </p>
      )}
      <div
        className="col-span-full flex cursor-pointer items-center gap-x-1"
        onClick={() =>
          setAreTextsVisible((prevState) => ({
            ...prevState,
            affiliatedWith: !prevState.affiliatedWith,
          }))
        }
      >
        {areTextsVisible.affiliatedWith ? (
          <span className="text-nowrap text-sm font-medium text-via">
            Affiliated with:
          </span>
        ) : (
          <HeartHandshake className="h-4 w-4 shrink-0 text-via" />
        )}
        <span className="truncate text-sm">{achievement.affiliatedWith}</span>
      </div>
    </div>
  );
}
