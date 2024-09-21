"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  Info,
  Pencil,
  Trash2,
} from "lucide-react";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";

type AchievementOptionsProps = {
  achievement: Doc<"achievements">;
  handleSelectAchievement?: (achievement: Doc<"achievements">) => void;
  viewOnly?: boolean;
};

export default function AchievementOptions({
  achievement,
  handleSelectAchievement,
  viewOnly,
}: AchievementOptionsProps) {
  const [isPending, startTransition] = useTransition();
  const deleteAchievement = useMutation(api.achievements.deleteAchievement);
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const { handleOpen } = useModalStore();

  function handleAchievementDelete() {
    startTransition(async () => {
      try {
        await deleteAchievement({ achievementId: achievement._id });

        setAreOptionsVisible(false);
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <div className="flex flex-row-reverse items-center gap-x-1 sm:flex-row">
      {areOptionsVisible && (
        <div className="flex items-center gap-x-1">
          <Button
            className="h-6 w-6 rounded-full"
            size="icon"
            disabled={isPending}
            onClick={() =>
              viewOnly && handleSelectAchievement
                ? handleSelectAchievement(achievement)
                : handleOpen("achievementInfo", { achievement })
            }
          >
            <Info className="h-4 w-4 shrink-0" />
          </Button>
          {!viewOnly && (
            <Button
              className="h-6 w-6 rounded-full"
              variant="secondary"
              size="icon"
              disabled={isPending}
              onClick={() => handleOpen("manageAchievement", { achievement })}
            >
              <Pencil className="h-3.5 w-3.5 shrink-0" />
            </Button>
          )}
          {!viewOnly && (
            <Button
              className="h-6 w-6 rounded-full"
              variant="destructive"
              size="icon"
              disabled={isPending}
              onClick={handleAchievementDelete}
            >
              <Trash2 className="h-4 w-4 shrink-0" />
            </Button>
          )}
        </div>
      )}
      <Button
        className="h-6 w-6 rounded-full"
        variant="outline"
        size="icon"
        onClick={() => setAreOptionsVisible(!areOptionsVisible)}
      >
        {areOptionsVisible ? (
          <ChevronsRightLeft className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronsLeftRight className="h-4 w-4 shrink-0" />
        )}
      </Button>
    </div>
  );
}
