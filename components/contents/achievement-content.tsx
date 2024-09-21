"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { Award } from "lucide-react";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import Achievement from "@/components/contents/achievement";
import AddAchievement from "@/components/contents/add-achievement";

type AchievementContentProps = {
  user?: Doc<"users">;
  handleSelectAchievement?: (achievement: Doc<"achievements">) => void;
  viewOnly?: boolean;
};

export default function AchievementContent({
  user,
  handleSelectAchievement,
  viewOnly,
}: AchievementContentProps) {
  const achievements = useQuery(
    api.achievements.getAchievements,
    user ? { userId: user._id } : {},
  );
  const [prevAchievementsLength, setPrevAchievementsLength] = useState(0);
  const scrollAreaContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (achievements) {
      if (
        achievements.length > prevAchievementsLength &&
        prevAchievementsLength !== 0
      ) {
        if (scrollAreaContentRef.current) {
          scrollAreaContentRef.current.scrollIntoView(false);
        }
      }

      setPrevAchievementsLength(achievements.length);
    }
  }, [achievements, prevAchievementsLength]);

  return (
    <div
      className={cn(
        "flex w-[318px] flex-col items-center gap-y-3 sm:w-[500px]",
        {
          "w-full": !!viewOnly,
        },
      )}
    >
      {achievements ? (
        achievements.length === 0 ? (
          viewOnly && (
            <div className="flex items-center gap-x-2 text-muted-foreground">
              <Award className="h-5 w-5 shrink-0" />
              <p>No achievements found.</p>
            </div>
          )
        ) : (
          <ScrollArea
            className="w-full px-6"
            classNameViewport="max-h-[350px] sm:max-h-72"
          >
            <div
              className="flex flex-col items-center justify-center gap-y-3"
              ref={scrollAreaContentRef}
            >
              {achievements.map((achievement) => (
                <Achievement
                  key={achievement._id}
                  achievement={achievement}
                  handleSelectAchievement={handleSelectAchievement}
                  viewOnly={viewOnly}
                />
              ))}
            </div>
          </ScrollArea>
        )
      ) : (
        <Spinner type="circular" size="icon" />
      )}
      {!viewOnly && <AddAchievement />}
    </div>
  );
}
