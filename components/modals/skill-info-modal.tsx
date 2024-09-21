"use client";

import { useModalStore } from "@/stores/use-modal-store";
import Modal from "@/components/ui/modal";
import SkillDetails from "@/components/contents/skill-details";

export default function SkillInfoModal() {
  const { type, data, handleClose } = useModalStore();

  const skill = data?.skill;

  return (
    <Modal
      title="Skill details"
      description="View detailed information about your skills"
      isOpen={type === "skillInfo"}
      handleClose={handleClose}
    >
      {skill && <SkillDetails skill={skill} />}
    </Modal>
  );
}
