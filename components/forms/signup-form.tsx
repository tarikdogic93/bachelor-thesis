"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";

import { handleError } from "@/lib/utils";
import { signupFormSchema } from "@/schemas/auth-schemas";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";
import RadioGroupControl from "@/components/form-controls/radio-group-control";

export default function SignupForm() {
  const [isPending, setIsPending] = useState(false);
  const { setAuthMode } = useModalStore();
  const { isLoaded, signUp } = useSignUp();

  type SignupFormValuesType = z.infer<typeof signupFormSchema>;

  const defaultValues: SignupFormValuesType = {
    role: "",
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  };

  const signupForm = useForm<SignupFormValuesType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues,
  });

  async function handleSignUp({ role, ...restValues }: SignupFormValuesType) {
    if (!isLoaded) {
      return;
    }

    try {
      setIsPending(true);

      await signUp.create({
        ...restValues,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setIsPending(false);

      setAuthMode("verify", role as Doc<"users">["role"]);
    } catch (error) {
      setIsPending(false);

      toast.error(handleError(error, undefined, undefined, true));
    }
  }

  return (
    <Form {...signupForm}>
      <form
        className="space-y-4"
        onSubmit={signupForm.handleSubmit(handleSignUp)}
        noValidate
      >
        <RadioGroupControl
          control={signupForm.control}
          name="role"
          label="Role"
          items={Object.values(["Applicant", "Company"] as Exclude<
            Doc<"users">["role"],
            "Admin" | undefined
          >[]).map((role) => ({
            label: role,
            value: role,
          }))}
          disabled={isPending}
        />
        <InputControl
          control={signupForm.control}
          name="firstName"
          label="First name"
          placeholder="Enter your first name"
          disabled={isPending}
        />
        <InputControl
          control={signupForm.control}
          name="lastName"
          label="Last name"
          placeholder="Enter your last name"
          disabled={isPending}
        />
        <InputControl
          control={signupForm.control}
          type="email"
          name="emailAddress"
          label="Email address"
          placeholder="Enter your email address"
          disabled={isPending}
        />
        <InputControl
          control={signupForm.control}
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
