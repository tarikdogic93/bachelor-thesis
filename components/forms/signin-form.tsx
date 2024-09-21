"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleError } from "@/lib/utils";
import { signinFormSchema } from "@/schemas/auth-schemas";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";

type SigninFormValuesType = z.infer<typeof signinFormSchema>;

const defaultValues: SigninFormValuesType = {
  emailAddress: "",
  password: "",
};

export default function SigninForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isPending, setIsPending] = useState(false);
  const { handleClose } = useModalStore();

  const signinForm = useForm<SigninFormValuesType>({
    resolver: zodResolver(signinFormSchema),
    defaultValues,
  });

  async function handleSignIn({
    emailAddress,
    password,
  }: SigninFormValuesType) {
    if (!isLoaded) {
      return;
    }

    try {
      setIsPending(true);

      const result = await signIn.create({
        identifier: emailAddress,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

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
    <Form {...signinForm}>
      <form
        className="space-y-4"
        onSubmit={signinForm.handleSubmit(handleSignIn)}
        noValidate
      >
        <InputControl
          control={signinForm.control}
          type="email"
          name="emailAddress"
          label="Email address"
          placeholder="Enter your email address"
          disabled={isPending}
        />
        <InputControl
          control={signinForm.control}
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
