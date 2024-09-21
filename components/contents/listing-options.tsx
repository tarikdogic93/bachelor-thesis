"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  Info,
  Pencil,
  Trash2,
} from "lucide-react";
import { useMutation } from "convex/react";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";

type ListingOptionsProps = {
  currentUser?: Doc<"users"> | null;
  job: Doc<"jobs">;
};

export default function ListingOptions({
  currentUser,
  job,
}: ListingOptionsProps) {
  const [isPending, startTransition] = useTransition();
  const deleteJob = useMutation(api.jobs.deleteJob);
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const { handleOpen } = useModalStore();

  function handleJobDelete() {
    startTransition(async () => {
      try {
        await deleteJob({ jobId: job._id });

        setAreOptionsVisible(false);
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <div className="flex items-center gap-x-1 self-start">
      {areOptionsVisible &&
        (currentUser?.role !== "Company" ||
          currentUser?._id === job.userId) && (
          <div className="flex items-center gap-x-1">
            <Button
              className="h-6 w-6 rounded-full"
              size="icon"
              disabled={isPending}
              onClick={() => handleOpen("jobInfo", { job })}
            >
              <Info className="h-4 w-4 shrink-0" />
            </Button>
            {currentUser?.role === "Company" && (
              <Button
                className="h-6 w-6 rounded-full"
                variant="secondary"
                size="icon"
                disabled={isPending}
                onClick={() => handleOpen("manageJob", { job })}
              >
                <Pencil className="h-3.5 w-3.5 shrink-0" />
              </Button>
            )}
            {currentUser?.role !== "Applicant" && (
              <Button
                className="h-6 w-6 rounded-full"
                variant="destructive"
                size="icon"
                disabled={isPending}
                onClick={handleJobDelete}
              >
                <Trash2 className="h-4 w-4 shrink-0" />
              </Button>
            )}
          </div>
        )}
      <Button
        className="h-6 w-6 rounded-full"
        variant="outline"
        size="icon"
        onClick={() => setAreOptionsVisible(!areOptionsVisible)}
      >
        {areOptionsVisible ? (
          <ChevronsRightLeft className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronsLeftRight className="h-4 w-4 shrink-0" />
        )}
      </Button>
    </div>
  );
}
