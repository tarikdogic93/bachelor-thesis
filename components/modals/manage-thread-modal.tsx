"use client";

import { useModalStore } from "@/stores/use-modal-store";
import Modal from "@/components/ui/modal";
import ManageThreadForm from "@/components/forms/manage-thread-form";

export default function ManageThreadModal() {
  const { type, data, handleClose } = useModalStore();

  const thread = data?.thread;

  return (
    <Modal
      title="Manage threads"
      description="Handle thread creation and editing"
      isOpen={type === "manageThread"}
      handleClose={handleClose}
    >
      <div className="rounded-md border p-6">
        <ManageThreadForm editThread={thread} />
      </div>
    </Modal>
  );
}
