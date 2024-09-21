"use client";

import { useModalStore } from "@/stores/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";
import ManageAchievementForm from "@/components/forms/manage-achievement-form";

export default function ManageAchievementModal() {
  const { type, data, handleClose } = useModalStore();

  const achievement = data?.achievement;

  return (
    <Modal
      title="Manage achievements"
      description="Fine-tune your recognized achievements"
      isOpen={type === "manageAchievement"}
      handleClose={handleClose}
    >
      <div className="rounded-md border px-0 py-6">
        <ScrollArea
          className="h-full w-full px-6"
          classNameViewport="max-h-[340px]"
        >
          <ManageAchievementForm editAchievement={achievement} />
        </ScrollArea>
      </div>
    </Modal>
  );
}
