"use client";

import { useModalStore } from "@/stores/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";
import ManageProjectForm from "@/components/forms/manage-project-form";

export default function ManageProjectModal() {
  const { type, data, handleClose } = useModalStore();

  const project = data?.project;

  return (
    <Modal
      title="Manage projects"
      description="Seamlessly adjust project details"
      isOpen={type === "manageProject"}
      handleClose={handleClose}
    >
      <div className="rounded-md border px-0 py-6">
        <ScrollArea className="h-full w-full px-6" classNameViewport="max-h-80">
          <ManageProjectForm editProject={project} />
        </ScrollArea>
      </div>
    </Modal>
  );
}
