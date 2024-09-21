"use client";

import { ImagePlus } from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type PersonalInfoImageProps = {
  user: Doc<"users">;
};

export default function PersonalInfoImage({ user }: PersonalInfoImageProps) {
  const { handleOpen } = useModalStore();

  return (
    <Avatar
      className="h-44 w-44 cursor-pointer hover:scale-[1.02]"
      onClick={() => handleOpen("managePersonalInfo", { user }, "image")}
    >
      <AvatarImage src={user.imageUrl} />
      <AvatarFallback className="cursor-pointer flex-col gap-y-2">
        <ImagePlus className="h-7 w-7 shrink-0" />
        <span className="text-sm font-medium">Add image</span>
      </AvatarFallback>
    </Avatar>
  );
}
