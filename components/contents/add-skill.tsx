"use client";

import { PlusCircle, Sprout } from "lucide-react";

import { useModalStore } from "@/stores/use-modal-store";

export default function AddSkill() {
  const { handleOpen } = useModalStore();

  return (
    <div className="flex w-full items-center justify-center gap-x-2">
      <div className="w-fit rounded-full bg-muted-foreground/60 p-1.5">
        <Sprout className="h-5 w-5 shrink-0" />
      </div>
      <p className="font-medium">Add skills</p>
      <PlusCircle
        className="h-5 w-5 shrink-0 cursor-pointer"
        onClick={() => handleOpen("manageSkill")}
      />
    </div>
  );
}
