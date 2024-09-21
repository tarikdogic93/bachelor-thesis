"use client";

import { useModalStore } from "@/stores/use-modal-store";
import Modal from "@/components/ui/modal";
import ManageSkillForm from "@/components/forms/manage-skill-form";

export default function ManageSkillModal() {
  const { type, data, handleClose } = useModalStore();

  const skill = data?.skill;

  return (
    <Modal
      title="Manage skills"
      description="Customize the list of your professional abilities"
      isOpen={type === "manageSkill"}
      handleClose={handleClose}
    >
      <div className="rounded-md border p-6">
        <ManageSkillForm editSkill={skill} />
      </div>
    </Modal>
  );
}
