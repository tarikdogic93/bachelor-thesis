import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Ban,
  CheckCheck,
  LogIn,
  LucideIcon,
  PersonStanding,
  ScanEye,
  ScanText,
  VenetianMask,
} from "lucide-react";
import { format, formatDistanceToNowStrict, isAfter } from "date-fns";
import { useMediaQuery } from "usehooks-ts";
import { toast } from "sonner";

import { cn, formatCurrency, formatNumber, handleError } from "@/lib/utils";
import { jobSectors } from "@/data/job-sector-data";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { useJobsStore } from "@/stores/use-jobs-store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Hint from "@/components/ui/hint";
import { LoadingButton } from "@/components/buttons/loading-button";
import ListingOptions from "@/components/contents/listing-options";

type ListingProps = {
  currentUser?: Doc<"users"> | null;
  job: Doc<"jobs">;
};

export default function Listing({ currentUser, job }: ListingProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { handleOpen } = useModalStore();
  const { activeJob, setActiveJob } = useJobsStore();
  const matchesXlMediaQuery = useMediaQuery("(min-width: 1280px)");
  const userWhoCreatedListing = useQuery(api.users.getUserById, {
    userId: job.userId,
  });
  const getJobApplicantsInfo = useQuery(
    api.jobApplicants.getJobApplicantsInfo,
    {
      jobId: job._id,
    },
  );
  const existingJobApplicant = useQuery(
    api.jobApplicants.getExistingJobApplicant,
    {
      jobId: job._id,
    },
  );
  const applyToJob = useMutation(api.jobs.applyToJob);

  function handleJobApplication() {
    if (
      !existingJobApplicant &&
      !isAfter(new Date(), job.applicationDeadline)
    ) {
      startTransition(async () => {
        try {
          await applyToJob({ jobId: job._id });
        } catch (error) {
          toast.error(handleError(error));
        }
      });
    }
  }

  const foundJobSector = jobSectors.find(
    (obj) => obj.category === job.jobSector,
  );

  const Icon: LucideIcon = foundJobSector?.icon || VenetianMask;

  return (
    <Card
      className={cn("h-fit", {
        "bg-muted/20": activeJob?._id === job._id,
        "opacity-50": isAfter(new Date(), job.applicationDeadline),
      })}
    >
      <CardContent className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center justify-between">
          {matchesXlMediaQuery ? (
            <>
              <div className="flex flex-col items-start gap-x-3 gap-y-1 md:flex-row md:items-center">
                {userWhoCreatedListing ? (
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={userWhoCreatedListing.imageUrl} />
                    <AvatarFallback>
                      {userWhoCreatedListing.companyName
                        ? userWhoCreatedListing.companyName[0]
                        : `${userWhoCreatedListing.firstName?.[0]} ${userWhoCreatedListing.lastName?.[0]}`}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-full bg-muted" />
                )}
                <div className="flex flex-col gap-y-1">
                  {userWhoCreatedListing && (
                    <p
                      className={cn("w-fit max-w-56 truncate", {
                        "underline-animation relative cursor-pointer":
                          currentUser?.role !== "Company",
                      })}
                      onClick={() => {
                        if (currentUser?.role !== "Company") {
                          handleOpen("companyInfo", {
                            user: userWhoCreatedListing,
                          });
                        }
                      }}
                    >
                      {userWhoCreatedListing.companyName
                        ? userWhoCreatedListing.companyName
                        : `${userWhoCreatedListing.firstName} ${userWhoCreatedListing.lastName}`}
                    </p>
                  )}
                  <p className="max-w-56 truncate text-sm text-muted-foreground">
                    {job.updateTime
                      ? `${format(job.updateTime, "PPP")} (Edited)`
                      : format(job._creationTime, "PPP")}
                  </p>
                </div>
              </div>
              <ListingOptions currentUser={currentUser} job={job} />
            </>
          ) : (
            <>
              <div className="flex w-full flex-col gap-y-1">
                <div className="flex items-center justify-between">
                  {userWhoCreatedListing ? (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={userWhoCreatedListing.imageUrl} />
                      <AvatarFallback>
                        {userWhoCreatedListing.companyName
                          ? userWhoCreatedListing.companyName[0]
                          : `${userWhoCreatedListing.firstName?.[0]} ${userWhoCreatedListing.lastName?.[0]}`}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-12 w-12 shrink-0 rounded-full bg-muted" />
                  )}
                  <ListingOptions currentUser={currentUser} job={job} />
                </div>
                <div className="flex flex-col gap-y-1">
                  {userWhoCreatedListing && (
                    <p
                      className={cn("w-fit max-w-56 truncate", {
                        "underline-animation relative cursor-pointer":
                          currentUser?.role !== "Company",
                      })}
                      onClick={() => {
                        if (currentUser?.role !== "Company") {
                          handleOpen("companyInfo", {
                            user: userWhoCreatedListing,
                          });
                        }
                      }}
                    >
                      {userWhoCreatedListing.companyName
                        ? userWhoCreatedListing.companyName
                        : `${userWhoCreatedListing.firstName} ${userWhoCreatedListing.lastName}`}
                    </p>
                  )}
                  <p className="max-w-56 truncate text-sm text-muted-foreground">
                    {job.updateTime
                      ? `${format(job.updateTime, "PPP")} (Edited)`
                      : format(job._creationTime, "PPP")}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="truncate text-2xl font-semibold">{job.title}</p>
          {job.settingType !== "Remote" && (
            <p className="truncate text-sm text-muted-foreground">
              {job.city}
              {job.country && `, ${job.country.name}`}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {isAfter(new Date(), job.applicationDeadline) ? (
              <span className="text-red-500">Application closed</span>
            ) : (
              <>
                Application closes on:{" "}
                <span className="text-accent-foreground">
                  {format(job.applicationDeadline, "PPP")}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Badge className="cursor-default gap-x-1.5" variant="outline">
            <Icon className="h-3.5 w-3.5 shrink-0 text-from" />
            {job.jobSector}
          </Badge>
          <Badge className="cursor-default" variant="outline">
            {job.jobType}
          </Badge>
          <Badge className="cursor-default" variant="outline">
            {job.settingType}
          </Badge>
          <Badge className="cursor-default" variant="outline">
            {job.experienceLevel}
          </Badge>
          <Badge className="cursor-default" variant="outline">
            {job.educationLevel}
          </Badge>
          <Badge className="cursor-default" variant="outline">
            {formatCurrency(job.salaryRangeMin, { minimumFractionDigits: 0 })} -{" "}
            {formatCurrency(job.salaryRangeMax, { minimumFractionDigits: 0 })}
          </Badge>
        </div>
        <div className="flex flex-col gap-y-4">
          <Separator />
          <div className="flex flex-col items-start gap-y-6 sm:flex-row sm:items-center sm:justify-between">
            <Hint label="Applicants" side="bottom" sideOffset={10}>
              <div className="flex items-center gap-x-1.5">
                <PersonStanding className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="font-semibold">
                  {getJobApplicantsInfo
                    ? formatNumber(getJobApplicantsInfo)
                    : 0}
                </span>
              </div>
            </Hint>
            <div className="flex items-center gap-x-2">
              {currentUser?.role === "Applicant" &&
                existingJobApplicant &&
                existingJobApplicant.status === "rejected" &&
                existingJobApplicant.rejectionReason && (
                  <Hint
                    label="Rejection reason"
                    side="bottom"
                    sideOffset={10}
                    asChild
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleOpen("jobRejectionInfo", {
                          rejectionReason: existingJobApplicant.rejectionReason,
                        })
                      }
                    >
                      <ScanEye className="h-[18px] w-[18px] shrink-0" />
                    </Button>
                  </Hint>
                )}
              {currentUser?.role === "Applicant" && existingJobApplicant && (
                <Hint
                  label={
                    existingJobApplicant.status === "processing"
                      ? "Processing..."
                      : existingJobApplicant.status === "accepted"
                        ? "Accepted"
                        : existingJobApplicant.status === "rejected"
                          ? "Rejected"
                          : "Unknown status"
                  }
                  side="bottom"
                  sideOffset={10}
                >
                  <div
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "cursor-default",
                    )}
                  >
                    {existingJobApplicant.status === "processing" ? (
                      <ScanText className="h-[18px] w-[18px] shrink-0" />
                    ) : existingJobApplicant.status === "accepted" ? (
                      <CheckCheck className="h-[18px] w-[18px] shrink-0 text-green-500" />
                    ) : existingJobApplicant.status === "rejected" ? (
                      <Ban className="h-[18px] w-[18px] shrink-0 text-red-500" />
                    ) : (
                      <VenetianMask className="h-[18px] w-[18px] shrink-0" />
                    )}
                  </div>
                </Hint>
              )}
              {currentUser?.role === "Applicant" && (
                <>
                  {isPending ? (
                    <LoadingButton variant="outline" />
                  ) : (
                    <Hint
                      label={
                        existingJobApplicant
                          ? `Applied ${formatDistanceToNowStrict(existingJobApplicant.appliedTime)} ago`
                          : isAfter(new Date(), job.applicationDeadline)
                            ? "Application deadline passed"
                            : "Apply to job"
                      }
                      side="bottom"
                      sideOffset={10}
                      asChild
                    >
                      <Button
                        className={cn({
                          "cursor-default opacity-50":
                            !!existingJobApplicant ||
                            isAfter(new Date(), job.applicationDeadline),
                        })}
                        variant="secondary"
                        size="icon"
                        onClick={handleJobApplication}
                      >
                        <LogIn className="h-4 w-4 shrink-0" />
                      </Button>
                    </Hint>
                  )}
                </>
              )}
              {currentUser?.role !== "Applicant" && (
                <Hint
                  label="View applicants"
                  side="bottom"
                  sideOffset={10}
                  asChild
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setActiveJob(job);

                      router.push("/dashboard/jobs/applicants");
                    }}
                  >
                    <PersonStanding className="h-4 w-4 shrink-0" />
                  </Button>
                </Hint>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
