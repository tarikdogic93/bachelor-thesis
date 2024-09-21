"use client";

import { useModalStore } from "@/stores/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";
import ManagePresencePreferencesForm from "@/components/forms/manage-presence-preferences-form";

export default function ManagePresenceModal() {
  const { type, data, handleClose } = useModalStore();

  const presencePreferences = data?.presencePreferences;

  return (
    <Modal
      title="Manage presence"
      description="Configure your presence preferences"
      isOpen={type === "managePresence"}
      handleClose={handleClose}
    >
      <div className="rounded-md border px-0 py-6">
        <ScrollArea
          className="h-full w-full px-6"
          classNameViewport="max-h-[340px]"
        >
          <ManagePresencePreferencesForm
            editPresencePreferences={presencePreferences}
          />
        </ScrollArea>
      </div>
    </Modal>
  );
}
