"use client";

import { useModalStore } from "@/stores/use-modal-store";
import Modal from "@/components/ui/modal";
import ManageJobRejectionForm from "@/components/forms/manage-job-rejection-form";

export default function ManageJobRejectionModal() {
  const { type, data, handleClose } = useModalStore();

  const job = data?.job;
  const user = data?.user;
  const rejectionReason = data?.rejectionReason;

  return (
    <Modal
      title="Provide feedback on rejection"
      description="Write a clear reason for the rejection to support the applicant's future growth"
      isOpen={type === "manageJobRejection"}
      handleClose={handleClose}
    >
      {job && user && (
        <ManageJobRejectionForm
          job={job}
          user={user}
          rejectionReason={rejectionReason}
        />
      )}
    </Modal>
  );
}
