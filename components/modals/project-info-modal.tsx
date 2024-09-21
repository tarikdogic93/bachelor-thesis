"use client";

import { useModalStore } from "@/stores/use-modal-store";
import Modal from "@/components/ui/modal";
import ProjectDetails from "@/components/contents/project-details";

export default function ProjectInfoModal() {
  const { type, data, handleClose } = useModalStore();

  const project = data?.project;

  return (
    <Modal
      title="Project details"
      description="View detailed information about your projects"
      isOpen={type === "projectInfo"}
      handleClose={handleClose}
    >
      {project && <ProjectDetails project={project} />}
    </Modal>
  );
}
