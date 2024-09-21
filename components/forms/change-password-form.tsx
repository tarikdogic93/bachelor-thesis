"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { changePasswordFormSchema } from "@/schemas/settings-schemas";
import { changeClerkUserPassword } from "@/actions/users";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";

type ChangePasswordFormValuesType = z.infer<typeof changePasswordFormSchema>;

const defaultValues: ChangePasswordFormValuesType = {
  oldPassword: "",
  newPassword: "",
};

type ChangePasswordFormProps = {
  signedInUserId: string;
};

export default function ChangePasswordForm({
  signedInUserId,
}: ChangePasswordFormProps) {
  const [isPending, startTransition] = useTransition();
  const { handleClose } = useModalStore();

  const changePasswordForm = useForm<ChangePasswordFormValuesType>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues,
  });

  function handlePasswordChange(values: ChangePasswordFormValuesType) {
    startTransition(async () => {
      const response = await changeClerkUserPassword(signedInUserId, {
        ...values,
      });

      if ("error" in response) {
        toast.error(response.error);
      } else {
        handleClose();

        toast.success("Successfully changed your password.");
      }
    });
  }

  return (
    <Form {...changePasswordForm}>
      <form
        className="space-y-4"
        onSubmit={changePasswordForm.handleSubmit(handlePasswordChange)}
        noValidate
      >
        <InputControl
          control={changePasswordForm.control}
          type="password"
          name="oldPassword"
          label="Old password"
          placeholder="Enter your old password"
          disabled={isPending}
        />
        <InputControl
          control={changePasswordForm.control}
          type="password"
          name="newPassword"
          label="New password"
          placeholder="Enter your new password"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
