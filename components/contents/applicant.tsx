"use client";

import { useQuery } from "convex/react";
import { CalendarDays, Info } from "lucide-react";
import { format } from "date-fns";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Hint from "@/components/ui/hint";
import { Button } from "@/components/ui/button";
import ApplicantAction from "@/components/contents/applicant-action";

type ApplicantProps = {
  currentUser?: Doc<"users"> | null;
  activeJob: Doc<"jobs">;
  applicant: Doc<"users">;
};

export default function Applicant({
  currentUser,
  activeJob,
  applicant,
}: ApplicantProps) {
  const { handleOpen } = useModalStore();
  const existingJobApplicant = useQuery(
    api.jobApplicants.getExistingJobApplicant,
    {
      jobId: activeJob._id,
      userId: applicant._id,
    },
  );

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-x-2 p-4">
        <div className="flex w-full flex-1 flex-col gap-y-4">
          <Avatar className="h-40 w-full rounded-md">
            <AvatarImage src={applicant.imageUrl} />
            <AvatarFallback className="rounded-md bg-gradient-to-b from-muted to-card">
              {applicant.firstName?.[0]}
              {applicant.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <p className="truncate text-xs text-muted-foreground">
            Applied for:{" "}
            <span className="font-medium text-accent-foreground">
              {activeJob.title}
            </span>
          </p>
          <div className="flex w-full flex-col justify-between gap-y-4 sm:flex-row sm:items-end">
            <div className="flex flex-col justify-between">
              <p className="max-w-52 truncate font-semibold">
                {applicant.firstName} {applicant.lastName}
              </p>
              <p className="max-w-52 truncate text-sm text-primary/80">
                {applicant.emailAddress}
              </p>
              <div className="mt-2 flex items-center gap-x-2">
                <CalendarDays className="h-4 w-4 shrink-0 opacity-70" />
                <span className="max-w-44 truncate text-xs font-medium text-primary/50">
                  Joined {format(applicant._creationTime, "PPP")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              {currentUser &&
                existingJobApplicant &&
                currentUser.role !== "Applicant" && (
                  <ApplicantAction
                    currentUser={currentUser}
                    activeJob={activeJob}
                    applicant={applicant}
                    status={existingJobApplicant.status}
                    rejectionReason={existingJobApplicant.rejectionReason}
                  />
                )}
              <Hint
                label="View applicant details"
                side="bottom"
                sideOffset={10}
                asChild
              >
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() =>
                    handleOpen("applicantInfo", { user: applicant })
                  }
                >
                  <Info className="h-4 w-4 shrink-0" />
                </Button>
              </Hint>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
