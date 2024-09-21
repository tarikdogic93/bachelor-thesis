"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";

import { handleError } from "@/lib/utils";
import { verifyFormSchema } from "@/schemas/auth-schemas";
import { setClerkUserRole } from "@/actions/users";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputOTPControl from "@/components/form-controls/input-otp-control";

export default function VerifyForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { role, handleClose } = useModalStore();
  const { isLoaded, signUp, setActive } = useSignUp();

  type VerifyFormValuesType = z.infer<typeof verifyFormSchema>;

  const defaultValues: VerifyFormValuesType = {
    code: "",
  };

  const verifyForm = useForm<VerifyFormValuesType>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues,
  });

  async function handleVerifySignUp({ code }: VerifyFormValuesType) {
    if (!isLoaded) {
      return;
    }

    try {
      setIsPending(true);

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        if (completeSignUp.createdUserId) {
          const response = await setClerkUserRole(
            completeSignUp.createdUserId,
            role,
          );

          if ("error" in response) {
            setIsPending(false);

            toast.error(response.error);
          }
        }

        await setActive({ session: completeSignUp.createdSessionId });

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
    <Form {...verifyForm}>
      <form
        className="space-y-4"
        onSubmit={verifyForm.handleSubmit(handleVerifySignUp)}
        noValidate
      >
        <InputOTPControl
          control={verifyForm.control}
          name="code"
          label="Verification code"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
