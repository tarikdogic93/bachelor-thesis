"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, useSignIn } from "@clerk/nextjs";

import { handleError } from "@/lib/utils";
import { forgotPasswordFormSchema } from "@/schemas/auth-schemas";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";

type ForgotPasswordFormProps = {
  setResetPasswordIdentifier: (identifier: string) => void;
};

export default function ForgotPasswordForm({
  setResetPasswordIdentifier,
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { setAuthMode } = useModalStore();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn } = useSignIn();

  type ForgotPasswordFormValuesType = z.infer<typeof forgotPasswordFormSchema>;

  const defaultValues: ForgotPasswordFormValuesType = {
    emailAddress: "",
  };

  const forgotPasswordForm = useForm<ForgotPasswordFormValuesType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues,
  });

  async function handlePasswordResetCode({
    emailAddress,
  }: ForgotPasswordFormValuesType) {
    if (!isLoaded) {
      return;
    }

    try {
      if (isSignedIn) {
        router.push("/dashboard");
      }

      setIsPending(true);

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });

      setResetPasswordIdentifier(emailAddress);

      setIsPending(false);

      setAuthMode("resetPassword");
    } catch (error) {
      setIsPending(false);

      toast.error(handleError(error, undefined, undefined, true));
    }
  }

  return (
    <Form {...forgotPasswordForm}>
      <form
        className="space-y-4"
        onSubmit={forgotPasswordForm.handleSubmit(handlePasswordResetCode)}
        noValidate
      >
        <InputControl
          control={forgotPasswordForm.control}
          type="email"
          name="emailAddress"
          label="Email address"
          placeholder="Enter your email address"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
