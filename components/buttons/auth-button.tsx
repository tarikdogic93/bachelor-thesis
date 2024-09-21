"use client";

import { Sparkles } from "lucide-react";

import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { handleOpen, setAuthMode } = useModalStore();

  return (
    <Button
      className="text-base"
      variant="special"
      onClick={() => {
        handleOpen("auth");
        setAuthMode("");
      }}
    >
      <span className="font-semibold tracking-wide">Authenticate</span>
      <Sparkles className="ml-2 h-5 w-5 shrink-0" />
    </Button>
  );
}
