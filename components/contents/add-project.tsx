"use client";

import { PlusCircle, Presentation } from "lucide-react";

import { useModalStore } from "@/stores/use-modal-store";

export default function AddProject() {
  const { handleOpen } = useModalStore();

  return (
    <div className="flex items-center justify-center gap-x-2">
      <div className="w-fit rounded-full bg-muted-foreground/60 p-1.5">
        <Presentation className="h-5 w-5 shrink-0" />
      </div>
      <p className="font-medium">Add project</p>
      <PlusCircle
        className="h-5 w-5 shrink-0 cursor-pointer"
        onClick={() => handleOpen("manageProject")}
      />
    </div>
  );
}
