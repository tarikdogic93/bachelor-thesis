"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSignIn, useSignUp } from "@clerk/nextjs";

import { titles, descriptions, footerTexts } from "@/data/auth-modal-data";
import { useModalStore } from "@/stores/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";
import SigninForm from "@/components/forms/signin-form";
import SignupForm from "@/components/forms/signup-form";
import ForgotPasswordForm from "@/components/forms/forgot-password-form";
import ResetPasswordForm from "@/components/forms/reset-password-form";
import VerifyForm from "@/components/forms/verify-form";
import AuthModalButtons from "@/components/buttons/auth-modal-buttons";
import AuthModalFooter from "@/components/modals/auth-modal-footer";

export default function AuthModal() {
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const { type, authMode, setAuthMode, handleClose } = useModalStore();
  const [resetPasswordIdentifier, setResetPasswordIdentifier] = useState("");

  const footers = {
    "": null,
    signin: (
      <AuthModalFooter
        paragraphText={footerTexts.signin.paragraphText}
        buttonText={footerTexts.signin.buttonText}
        handleClick={() => setAuthMode("signup")}
      />
    ),
    signup: (
      <AuthModalFooter
        paragraphText={footerTexts.signup.paragraphText}
        buttonText={footerTexts.signup.buttonText}
        handleClick={() => setAuthMode("signin")}
      />
    ),
    forgotPassword: (
      <AuthModalFooter
        paragraphText={footerTexts.forgotPassword.paragraphText}
        buttonText={footerTexts.forgotPassword.buttonText}
        handleClick={() => setAuthMode("signin")}
      />
    ),
    resetPassword: (
      <AuthModalFooter
        paragraphText={footerTexts.resetPassword.paragraphText}
        buttonText={footerTexts.resetPassword.buttonText}
        handleClick={async () => {
          if (!isSignInLoaded) {
            return;
          }

          await signIn.create({
            strategy: "reset_password_email_code",
            identifier: resetPasswordIdentifier,
          });

          toast.info("Resent verification code.");
        }}
      />
    ),
    verify: (
      <AuthModalFooter
        paragraphText={footerTexts.verify.paragraphText}
        buttonText={footerTexts.verify.buttonText}
        handleClick={async () => {
          if (!isSignUpLoaded) {
            return;
          }

          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });

          toast.info("Resent verification code.");
        }}
      />
    ),
  };

  const title = titles[authMode];
  const description = descriptions[authMode];
  const footer = footers[authMode];

  const contents = {
    "": (
      <AuthModalButtons
        handleSignin={() => setAuthMode("signin")}
        handleSignup={() => setAuthMode("signup")}
        handleForgotPassword={() => setAuthMode("forgotPassword")}
      />
    ),
    signin: <SigninForm />,
    signup: <SignupForm />,
    forgotPassword: (
      <ForgotPasswordForm
        setResetPasswordIdentifier={setResetPasswordIdentifier}
      />
    ),
    resetPassword: <ResetPasswordForm />,
    verify: <VerifyForm />,
  };

  return (
    <Modal
      title={title}
      description={description}
      isOpen={type === "auth"}
      showBackButton={authMode !== ""}
      handleBack={() => setAuthMode("")}
      handleClose={handleClose}
      footer={footer}
    >
      {authMode === "" ? (
        <AuthModalButtons
          handleSignin={() => setAuthMode("signin")}
          handleSignup={() => setAuthMode("signup")}
          handleForgotPassword={() => setAuthMode("forgotPassword")}
        />
      ) : (
        <div className="rounded-md border px-0 py-6">
          <ScrollArea
            className="h-full w-full px-6"
            classNameViewport="max-h-[330px]"
          >
            {contents[authMode]}
          </ScrollArea>
        </div>
      )}
    </Modal>
  );
}
