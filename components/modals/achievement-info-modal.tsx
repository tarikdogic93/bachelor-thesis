"use client";

import { useModalStore } from "@/stores/use-modal-store";
import Modal from "@/components/ui/modal";
import AchievementDetails from "@/components/contents/achievement-details";

export default function AchievementInfoModal() {
  const { type, data, handleClose } = useModalStore();

  const achievement = data?.achievement;

  return (
    <Modal
      title="Achievement details"
      description="View detailed information about your achievements"
      isOpen={type === "achievementInfo"}
      handleClose={handleClose}
    >
      {achievement && <AchievementDetails achievement={achievement} />}
    </Modal>
  );
}
