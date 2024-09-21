"use client";

import { format } from "date-fns";
import { CircleCheck } from "lucide-react";

import { useModalStore } from "@/stores/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";

export default function JobInfoModal() {
  const { type, data, handleClose } = useModalStore();

  const job = data?.job;

  return (
    <Modal
      title="Job listing"
      description="View detailed information about your job listings"
      isOpen={type === "jobInfo"}
      handleClose={handleClose}
    >
      {job && (
        <div className="rounded-md border px-0 py-6">
          <ScrollArea
            className="h-full w-full px-6"
            classNameViewport="max-h-72"
          >
            <div className="grid grid-cols-4 gap-3">
              <h3 className="col-span-full truncate font-semibold">
                {job.title}
              </h3>
              <p className="col-span-full truncate text-sm">
                Start date: {format(job.startDate, "PPP")}
              </p>
              <div className="col-span-full flex flex-col gap-y-1 text-sm">
                <h4>Job benefits:</h4>
                {job.benefits.length > 0 ? (
                  <ul className="list-inside">
                    {job.benefits.map((benefit, index) => (
                      <li
                        key={`benefit-${index}`}
                        className="flex items-center gap-x-2"
                      >
                        <CircleCheck className="h-4 w-4 shrink-0 text-via" />
                        <span className="truncate">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Not specified.
                  </p>
                )}
              </div>
              <div className="col-span-full flex flex-col gap-y-1 text-sm">
                <h4>Tech stack used:</h4>
                {job.techStack.length > 0 ? (
                  <ul className="list-inside">
                    {job.techStack.map((tech, index) => (
                      <li
                        key={`tech-${index}`}
                        className="flex items-center gap-x-2"
                      >
                        <CircleCheck className="h-4 w-4 shrink-0 text-via" />
                        <span className="truncate">{tech}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Not specified.
                  </p>
                )}
              </div>
              <div className="col-span-full flex flex-col gap-y-1 text-sm">
                <h4>Requirements:</h4>
                {job.requirements.length > 0 ? (
                  <ul className="list-inside">
                    {job.requirements.map((requirement, index) => (
                      <li
                        key={`requirement-${index}`}
                        className="flex items-center gap-x-2"
                      >
                        <CircleCheck className="h-4 w-4 shrink-0 text-via" />
                        <span className="truncate">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Not specified.
                  </p>
                )}
              </div>
              <div className="col-span-full flex flex-col gap-y-1 text-sm">
                <h4>Responsibilities:</h4>
                {job.responsibilities.length > 0 ? (
                  <ul className="list-inside">
                    {job.responsibilities.map((responsibility, index) => (
                      <li
                        key={`responsibility-${index}`}
                        className="flex items-center gap-x-2"
                      >
                        <CircleCheck className="h-4 w-4 shrink-0 text-via" />
                        <span className="truncate">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Not specified.
                  </p>
                )}
              </div>
              {job.description && (
                <p className="col-span-full text-sm text-muted-foreground">
                  {job.description}
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </Modal>
  );
}
