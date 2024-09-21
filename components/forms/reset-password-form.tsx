"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";

import { handleError } from "@/lib/utils";
import { resetPasswordFormSchema } from "@/schemas/auth-schemas";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputOTPControl from "@/components/form-controls/input-otp-control";
import InputControl from "@/components/form-controls/input-control";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { handleClose } = useModalStore();
  const { isLoaded, signIn, setActive } = useSignIn();

  type ResetPasswordFormValuesType = z.infer<typeof resetPasswordFormSchema>;

  const defaultValues: ResetPasswordFormValuesType = {
    code: "",
    newPassword: "",
  };

  const resetPasswordForm = useForm<ResetPasswordFormValuesType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues,
  });

  async function handleResetPassowrd({
    code,
    newPassword,
  }: ResetPasswordFormValuesType) {
    if (!isLoaded) return;

    try {
      setIsPending(true);

      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });

        setIsPending(false);

        handleClose();

        router.push("/dashboard");
      }
    } catch (error) {
      setIsPending(false);

      toast.error(handleError(error, undefined, undefined, true));
    }
  }

  return (
    <Form {...resetPasswordForm}>
      <form
        className="space-y-4"
        onSubmit={resetPasswordForm.handleSubmit(handleResetPassowrd)}
        noValidate
      >
        <InputOTPControl
          control={resetPasswordForm.control}
          name="code"
          label="Verification code"
          disabled={isPending}
        />
        <InputControl
          control={resetPasswordForm.control}
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
