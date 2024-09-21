"use client";

import { useModalStore } from "@/stores/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";
import ManagePersonalInfoForm from "@/components/forms/manage-personal-info-form";

export default function ManagePersonalInfoModal() {
  const { type, data, focusField, handleClose } = useModalStore();

  const user = data?.user;

  return (
    <Modal
      title="Manage personal info"
      description="Add or update your basic personal details"
      isOpen={type === "managePersonalInfo"}
      handleClose={handleClose}
    >
      {user && (
        <div className="rounded-md border px-0 py-6">
          <ScrollArea
            className="h-full w-full px-6"
            classNameViewport="max-h-[340px]"
          >
            <ManagePersonalInfoForm user={user} focusField={focusField} />
          </ScrollArea>
        </div>
      )}
    </Modal>
  );
}
