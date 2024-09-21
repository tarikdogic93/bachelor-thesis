"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldQuestion, ShieldX } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { presencePreferencesFormSchema } from "@/schemas/settings-schemas";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import SwitchControl from "@/components/form-controls/switch-control";

type PresencePreferencesFormValuesType = z.infer<
  typeof presencePreferencesFormSchema
>;

const defaultValues: PresencePreferencesFormValuesType = {
  showOnlinePresence: true,
  doNotDisturb: false,
};

type ManagePresencePreferencesFormProps = {
  editPresencePreferences?: Doc<"presencePreferences"> | null;
};

export default function ManagePresencePreferencesForm({
  editPresencePreferences,
}: ManagePresencePreferencesFormProps) {
  const [isPending, startTransition] = useTransition();
  const { handleClose } = useModalStore();
  const upsertPresencePreferences = useMutation(
    api.presence_preferences.upsertPresencePreferences,
  );

  let newDefaultValues = defaultValues;

  if (editPresencePreferences) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof PresencePreferencesFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => [key, editPresencePreferences[key]]),
    ) as PresencePreferencesFormValuesType;
  }

  const presencePreferencesForm = useForm<PresencePreferencesFormValuesType>({
    resolver: zodResolver(presencePreferencesFormSchema),
    defaultValues: newDefaultValues,
  });

  function handlePresencePreferencesSubmit(
    values: PresencePreferencesFormValuesType,
  ) {
    startTransition(async () => {
      try {
        await upsertPresencePreferences({
          ...values,
        });

        toast.success("Presence preferences have been successfully updated.");

        handleClose();
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <Form {...presencePreferencesForm}>
      <form
        className="space-y-4"
        onSubmit={presencePreferencesForm.handleSubmit(
          handlePresencePreferencesSubmit,
        )}
      >
        <SwitchControl
          control={presencePreferencesForm.control}
          name="showOnlinePresence"
          icon={ShieldQuestion}
          label="Show online presence"
          disabled={isPending}
        />
        <SwitchControl
          control={presencePreferencesForm.control}
          name="doNotDisturb"
          icon={ShieldX}
          label="Do not disturb"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
