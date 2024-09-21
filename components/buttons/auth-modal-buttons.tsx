"use client";

import { useMediaQuery } from "usehooks-ts";
import { KeyRound, LogIn, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";

type AuthModalButtonsProps = {
  handleSignin: () => void;
  handleSignup: () => void;
  handleForgotPassword: () => void;
};

export default function AuthModalButtons({
  handleSignin,
  handleSignup,
  handleForgotPassword,
}: AuthModalButtonsProps) {
  const matchesSmMediaQuery = useMediaQuery("(min-width: 640px)");

  return (
    <div className={cn("flex items-center justify-center gap-x-6 sm:gap-x-2")}>
      {matchesSmMediaQuery ? (
        <>
          <Button className="gap-x-2" variant="ghost" onClick={handleSignin}>
            <LogIn className="h-4 w-4 shrink-0" />
            <span className="text-base">Sign in</span>
          </Button>
          <Button className="gap-x-2" variant="ghost" onClick={handleSignup}>
            <Upload className="h-4 w-4 shrink-0" />
            <span className="text-base">Sign up</span>
          </Button>
          <Button
            className="gap-x-2"
            variant="ghost"
            onClick={handleForgotPassword}
          >
            <KeyRound className="h-4 w-4 shrink-0" />
            <span className="text-base">Forgot password</span>
          </Button>
        </>
      ) : (
        <>
          <Hint label="Sign in" side="bottom" sideOffset={10} asChild>
            <Button variant="ghost" onClick={handleSignin}>
              <LogIn className="h-5 w-5 shrink-0" />
            </Button>
          </Hint>
          <Hint label="Sign up" side="bottom" sideOffset={10} asChild>
            <Button variant="ghost" onClick={handleSignup}>
              <Upload className="h-5 w-5 shrink-0" />
            </Button>
          </Hint>
          <Hint label="Forgot password" side="bottom" sideOffset={10} asChild>
            <Button variant="ghost" onClick={handleForgotPassword}>
              <KeyRound className="h-5 w-5 shrink-0" />
            </Button>
          </Hint>
        </>
      )}
    </div>
  );
}
