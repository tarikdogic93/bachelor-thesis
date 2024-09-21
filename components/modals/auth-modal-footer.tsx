"use client";

import { Button } from "@/components/ui/button";

type AuthModalFooterProps = {
  paragraphText: string;
  buttonText: string;
  handleClick: () => void;
};

export default function AuthModalFooter({
  paragraphText,
  buttonText,
  handleClick,
}: AuthModalFooterProps) {
  return (
    <p className="w-full text-center text-sm">
      {paragraphText}
      <Button
        className="p-0 font-semibold"
        variant="link"
        onClick={handleClick}
      >
        {buttonText}
      </Button>
      .
    </p>
  );
}
