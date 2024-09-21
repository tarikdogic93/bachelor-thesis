"use client";

import { useModalStore } from "@/stores/use-modal-store";
import Modal from "@/components/ui/modal";
import ChangePasswordForm from "@/components/forms/change-password-form";

export default function ChangePasswordModal() {
  const { type, data, handleClose } = useModalStore();

  const signedInUserId = data?.signedInUserId;

  return (
    <Modal
      title="Change your password"
      description="Strengthen your security with a new password"
      isOpen={type === "changePassword"}
      handleClose={handleClose}
    >
      {signedInUserId && (
        <div className="rounded-md border p-6">
          <ChangePasswordForm signedInUserId={signedInUserId} />
        </div>
      )}
    </Modal>
  );
}
