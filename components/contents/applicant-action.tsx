"use client";

import { useTransition, useState } from "react";
import { useMutation } from "convex/react";
import { useMediaQuery } from "usehooks-ts";
import { Ban, CheckCheck, ScanText, VenetianMask, Wand } from "lucide-react";
import { toast } from "sonner";

import { cn, handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";

type ApplicantActionProps = {
  currentUser: Doc<"users">;
  activeJob: Doc<"jobs">;
  applicant: Doc<"users">;
  status: Doc<"jobApplicants">["status"];
  rejectionReason: Doc<"jobApplicants">["rejectionReason"];
};

export default function ApplicantAction({
  currentUser,
  activeJob,
  applicant,
  status,
  rejectionReason,
}: ApplicantActionProps) {
  const [isPending, startTransition] = useTransition();
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const { handleOpen } = useModalStore();
  const matchesSmMediaQuery = useMediaQuery("(min-width: 640px)");
  const updateJobApplicantStatus = useMutation(
    api.jobApplicants.updateJobApplicantStatus,
  );

  async function handleJobApplicantStatusUpdate(
    newStatus: Exclude<Doc<"jobApplicants">["status"], "processing">,
  ) {
    startTransition(async () => {
      if (status !== newStatus) {
        try {
          await updateJobApplicantStatus({
            jobId: activeJob._id,
            userId: applicant._id,
            status: newStatus,
          });

          if (newStatus === "rejected") {
            handleOpen("manageJobRejection", {
              job: activeJob,
              user: applicant,
              rejectionReason,
            });
          }
        } catch (error) {
          toast.error(handleError(error));
        }
      } else if (newStatus === "rejected") {
        handleOpen("manageJobRejection", {
          job: activeJob,
          user: applicant,
          rejectionReason,
        });
      }
    });
  }

  return (
    <DropdownMenu
      open={isDropdownMenuOpen}
      onOpenChange={() => {
        if (currentUser.role === "Company") {
          setIsDropdownMenuOpen(!isDropdownMenuOpen);
        }
      }}
    >
      <Hint
        label={
          status === "processing"
            ? currentUser.role === "Admin"
              ? "Processing..."
              : "Action"
            : status === "accepted"
              ? "Accepted"
              : status === "rejected"
                ? "Rejected"
                : "Unknown status"
        }
        side={
          currentUser.role === "Admin" || !matchesSmMediaQuery
            ? "bottom"
            : "left"
        }
        sideOffset={10}
        asChild
      >
        <DropdownMenuTrigger asChild>
          <Button
            className={cn({
              "cursor-default": currentUser.role === "Admin",
            })}
            variant="outline"
            size="icon"
          >
            {status === "processing" ? (
              currentUser.role === "Admin" ? (
                <ScanText className="h-[18px] w-[18px] shrink-0" />
              ) : (
                <Wand className="h-[18px] w-[18px] shrink-0" />
              )
            ) : status === "accepted" ? (
              <CheckCheck className="h-[18px] w-[18px] shrink-0 text-green-500" />
            ) : status === "rejected" ? (
              <Ban className="h-[18px] w-[18px] shrink-0 text-red-500" />
            ) : (
              <VenetianMask className="h-[18px] w-[18px] shrink-0" />
            )}
          </Button>
        </DropdownMenuTrigger>
      </Hint>
      <DropdownMenuContent
        align={matchesSmMediaQuery ? "end" : "start"}
        sideOffset={5}
      >
        <DropdownMenuItem className="w-full cursor-pointer p-0">
          <Button
            className="w-full gap-x-2"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => handleJobApplicantStatusUpdate("accepted")}
          >
            <CheckCheck className="h-4 w-4 shrink-0 text-green-500" />
            <span className="font-semibold">Accept</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="w-full cursor-pointer p-0">
          <Button
            className="w-full gap-x-2"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => handleJobApplicantStatusUpdate("rejected")}
          >
            <Ban className="h-4 w-4 shrink-0 text-red-500" />
            <span className="font-semibold">Reject</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
