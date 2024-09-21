"use client";

import { useModalStore } from "@/stores/use-modal-store";
import Modal from "@/components/ui/modal";
import ExperienceDetails from "@/components/contents/experience-details";

export default function ExperienceInfoModal() {
  const { type, data, handleClose } = useModalStore();

  const experience = data?.experience;

  return (
    <Modal
      title="Experience details"
      description="View detailed information about your experiences"
      isOpen={type === "experienceInfo"}
      handleClose={handleClose}
    >
      {experience && <ExperienceDetails experience={experience} />}
    </Modal>
  );
}
