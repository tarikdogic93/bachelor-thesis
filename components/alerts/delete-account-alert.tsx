"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { OctagonX } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import { handleError } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { deleteClerkUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingButton } from "@/components/buttons/loading-button";

type DeleteAccountAlertProps = {
  user?: Doc<"users"> | null;
  deleteingSelf?: boolean;
};

export default function DeleteAccountAlert({
  user,
  deleteingSelf,
}: DeleteAccountAlertProps) {
  const { signOut } = useClerk();
  const [isPending, startTransition] = useTransition();
  const matchesSmMediaQuery = useMediaQuery("(min-width: 640px)");
  const [isDeleteAccountAlertOpen, setIsDeleteAccountAlertOpen] =
    useState(false);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      toast.error(handleError(error, undefined, undefined, true));
    }
  }

  function handleAccountDelete() {
    startTransition(async () => {
      if (user) {
        const response = await deleteClerkUser(user.externalId);

        if ("error" in response) {
          toast.error(response.error);
        } else {
          setIsDeleteAccountAlertOpen(false);

          toast.success("This account has been successfully deleted.");

          if (deleteingSelf) {
            handleSignOut();
          }
        }
      }
    });
  }

  return (
    <AlertDialog open={isDeleteAccountAlertOpen}>
      {deleteingSelf && matchesSmMediaQuery ? (
        <AlertDialogTrigger asChild>
          <Button
            className="gap-x-2"
            variant="destructive"
            onClick={() => setIsDeleteAccountAlertOpen(true)}
          >
            <OctagonX className="h-4 w-4 shrink-0" />
            <span className="font-semibold">Delete account</span>
          </Button>
        </AlertDialogTrigger>
      ) : (
        <Hint label="Delete account" side="bottom" sideOffset={10} asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setIsDeleteAccountAlertOpen(true)}
            >
              <OctagonX className="h-4 w-4 shrink-0" />
            </Button>
          </AlertDialogTrigger>
        </Hint>
      )}
      <AlertDialogContent
        onOverlayClick={() => setIsDeleteAccountAlertOpen(false)}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently remove any data
            from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsDeleteAccountAlertOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            {isPending ? (
              <LoadingButton text="Deleting..." />
            ) : (
              <Button onClick={handleAccountDelete}>Confirm</Button>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
