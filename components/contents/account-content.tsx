"use client";

import { useQuery } from "convex/react";
import { useMediaQuery } from "usehooks-ts";
import { KeyRound } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";
import DeleteAccountAlert from "@/components/alerts/delete-account-alert";

export default function AccountContent() {
  const { handleOpen } = useModalStore();
  const matchesSmMediaQuery = useMediaQuery("(min-width: 640px)");
  const currentUser = useQuery(api.users.currentUser);

  return (
    <div className="flex items-center gap-x-4">
      {matchesSmMediaQuery ? (
        <Button
          className="gap-x-2"
          onClick={() =>
            handleOpen("changePassword", {
              signedInUserId: currentUser?.externalId,
            })
          }
        >
          <KeyRound className="h-4 w-4 shrink-0" />
          <span className="font-semibold">Change password</span>
        </Button>
      ) : (
        <Hint label="Change password" side="bottom" sideOffset={10} asChild>
          <Button
            size="icon"
            onClick={() =>
              handleOpen("changePassword", {
                signedInUserId: currentUser?.externalId,
              })
            }
          >
            <KeyRound className="h-4 w-4 shrink-0" />
          </Button>
        </Hint>
      )}
      <DeleteAccountAlert user={currentUser} deleteingSelf />
    </div>
  );
}
