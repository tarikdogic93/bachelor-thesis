"use client";

import { useModalStore } from "@/stores/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";
import ManageExperienceForm from "@/components/forms/manage-experience-form";

export default function ManageExperienceModal() {
  const { type, data, handleClose } = useModalStore();

  const experience = data?.experience;

  return (
    <Modal
      title="Manage experiences"
      description="Modify your work and educational history"
      isOpen={type === "manageExperience"}
      handleClose={handleClose}
    >
      <div className="rounded-md border px-0 py-6">
        <ScrollArea
          className="h-full w-full px-6"
          classNameViewport="max-h-[340px]"
        >
          <ManageExperienceForm editExperience={experience} />
        </ScrollArea>
      </div>
    </Modal>
  );
}
