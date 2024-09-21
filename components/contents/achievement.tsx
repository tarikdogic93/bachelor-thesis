import { format } from "date-fns";
import { useMediaQuery } from "usehooks-ts";
import { LucideIcon, VenetianMask } from "lucide-react";

import { achievements } from "@/data/achievements-data";
import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import Hint from "@/components/ui/hint";
import AchievementOptions from "@/components/contents/achievement-options";

type AchievementProps = {
  achievement: Doc<"achievements">;
  handleSelectAchievement?: (achievement: Doc<"achievements">) => void;
  viewOnly?: boolean;
};

export default function Achievement({
  achievement,
  handleSelectAchievement,
  viewOnly,
}: AchievementProps) {
  const matchesSmMediaQuery = useMediaQuery("(min-width: 640px)");

  const foundAchievement = achievements.find(
    (obj) => obj.category === achievement.category,
  );

  const Icon: LucideIcon = foundAchievement?.icon || VenetianMask;

  return (
    <Card className="w-full bg-muted/20">
      <CardContent className="flex flex-col items-center justify-between gap-y-3 p-4 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-y-1 sm:flex-row sm:gap-x-4">
          <Hint
            side={matchesSmMediaQuery ? "left" : "top"}
            sideOffset={10}
            label={`${achievement.category} achievement`}
          >
            <div className="rounded-full bg-from/80 p-3">
              <Icon className="h-6 w-6 shrink-0 text-white" />
            </div>
          </Hint>
          <div className="flex w-full flex-col items-center gap-y-0 sm:items-start sm:gap-y-2">
            <p className="max-w-56 truncate">{achievement.title}</p>
            <p className="max-w-56 truncate text-sm">
              {format(achievement.date, "PPP")}
            </p>
          </div>
        </div>
        <AchievementOptions
          achievement={achievement}
          handleSelectAchievement={handleSelectAchievement}
          viewOnly={viewOnly}
        />
      </CardContent>
    </Card>
  );
}
