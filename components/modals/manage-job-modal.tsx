"use client";

import { useModalStore } from "@/stores/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";
import ManageJobForm from "@/components/forms/manage-job-form";

export default function ManageJobModal() {
  const { type, data, handleClose } = useModalStore();

  const job = data?.job;

  return (
    <Modal
      title="Manage job listings"
      description="Facilitate straightforward job listing creation and update"
      isOpen={type === "manageJob"}
      handleClose={handleClose}
    >
      <div className="rounded-md border px-0 py-6">
        <ScrollArea className="h-full w-full px-6" classNameViewport="max-h-80">
          <ManageJobForm editJob={job} />
        </ScrollArea>
      </div>
    </Modal>
  );
}
