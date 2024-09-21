"use client";

import { useModalStore } from "@/stores/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";
import ManageNotificationPreferencesForm from "@/components/forms/manage-notification-preferences-form";

export default function ManageNotificationsModal() {
  const { type, data, handleClose } = useModalStore();

  const user = data?.user;
  const notificationPreferences = data?.notificationPreferences;

  return (
    <Modal
      title="Manage notifications"
      description="Configure your notification preferences"
      isOpen={type === "manageNotifications"}
      handleClose={handleClose}
    >
      <div className="rounded-md border px-0 py-6">
        {user && (
          <ScrollArea
            className="h-full w-full px-6"
            classNameViewport="max-h-60"
          >
            <ManageNotificationPreferencesForm
              user={user}
              editNotificationPreferences={notificationPreferences}
            />
          </ScrollArea>
        )}
      </div>
    </Modal>
  );
}
