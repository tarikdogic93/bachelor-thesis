"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { z } from "zod";
import { toast } from "sonner";
import { List, ListTree, MessageCircle, MessageSquareText } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { notificationPreferencesFormSchema } from "@/schemas/settings-schemas";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import SwitchControl from "@/components/form-controls/switch-control";

type NotificationPreferencesFormValuesType = z.infer<
  typeof notificationPreferencesFormSchema
>;

const defaultValues: NotificationPreferencesFormValuesType = {
  receiveJobNotifications: true,
  receivePostNotifications: true,
  receiveCommentNotifications: true,
  receiveMessageNotifications: true,
};

type ManageNotificationPreferencesFormProps = {
  user: Doc<"users">;
  editNotificationPreferences?: Doc<"notificationPreferences"> | null;
};

export default function ManageNotificationPreferencesForm({
  user,
  editNotificationPreferences,
}: ManageNotificationPreferencesFormProps) {
  const [isPending, startTransition] = useTransition();
  const { handleClose } = useModalStore();
  const upsertNotificationPreferences = useMutation(
    api.notification_preferences.upsertNotificationPreferences,
  );

  let newDefaultValues = defaultValues;

  if (editNotificationPreferences) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof NotificationPreferencesFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => [key, editNotificationPreferences[key]]),
    ) as NotificationPreferencesFormValuesType;
  }

  const notificationPreferencesForm =
    useForm<NotificationPreferencesFormValuesType>({
      resolver: zodResolver(notificationPreferencesFormSchema),
      defaultValues: newDefaultValues,
    });

  function handleNotificationPreferencesSubmit(
    values: NotificationPreferencesFormValuesType,
  ) {
    startTransition(async () => {
      try {
        await upsertNotificationPreferences({
          ...values,
        });

        toast.success(
          "Notification preferences have been successfully updated.",
        );

        handleClose();
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <Form {...notificationPreferencesForm}>
      <form
        className="space-y-4"
        onSubmit={notificationPreferencesForm.handleSubmit(
          handleNotificationPreferencesSubmit,
        )}
      >
        {user.role !== "Admin" && (
          <>
            <SwitchControl
              control={notificationPreferencesForm.control}
              name="receiveJobNotifications"
              icon={List}
              label="Receive job notifications"
              disabled={isPending}
            />
            <SwitchControl
              control={notificationPreferencesForm.control}
              name="receivePostNotifications"
              icon={ListTree}
              label="Receive post notifications"
              disabled={isPending}
            />
            <SwitchControl
              control={notificationPreferencesForm.control}
              name="receiveCommentNotifications"
              icon={MessageCircle}
              label="Receive comment notifications"
              disabled={isPending}
            />
          </>
        )}
        <SwitchControl
          control={notificationPreferencesForm.control}
          name="receiveMessageNotifications"
          icon={MessageSquareText}
          label="Receive message notifications"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
