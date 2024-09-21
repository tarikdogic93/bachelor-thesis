"use client";

import { useTransition } from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { manageJobRejectionFormSchema } from "@/schemas/jobs-schemas";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import TextAreaControl from "@/components/form-controls/text-area-control";
import { LoadingButton } from "@/components/buttons/loading-button";

type ManageJobRejectionFormValuesType = z.infer<
  typeof manageJobRejectionFormSchema
>;

const defaultValues: ManageJobRejectionFormValuesType = {
  text: "",
};

type ManageJobRejectionFormProps = {
  job: Doc<"jobs">;
  user: Doc<"users">;
  rejectionReason?: Doc<"jobApplicants">["rejectionReason"];
};

export default function ManageJobRejectionForm({
  job,
  user,
  rejectionReason,
}: ManageJobRejectionFormProps) {
  const [isPending, startTransition] = useTransition();
  const { handleClose } = useModalStore();
  const updateJobRejectionReason = useMutation(
    api.jobApplicants.updateJobApplicantRejectionReason,
  );

  let newDefaultValues = defaultValues;

  if (rejectionReason) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof ManageJobRejectionFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => [key, rejectionReason]),
    ) as ManageJobRejectionFormValuesType;
  }

  const manageJobRejectionForm = useForm<ManageJobRejectionFormValuesType>({
    resolver: zodResolver(manageJobRejectionFormSchema),
    defaultValues: newDefaultValues,
  });

  function handleJobRejectionSubmit({
    text,
  }: ManageJobRejectionFormValuesType) {
    startTransition(async () => {
      if (text) {
        try {
          await updateJobRejectionReason({
            jobId: job._id,
            userId: user._id,
            rejectionReason: text,
          });

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      }
    });
  }

  return (
    <Form {...manageJobRejectionForm}>
      <form
        className="space-y-4"
        onSubmit={manageJobRejectionForm.handleSubmit(handleJobRejectionSubmit)}
        noValidate
      >
        <TextAreaControl
          className="resize-none"
          control={manageJobRejectionForm.control}
          name="text"
          label="Job rejection"
          labelSrOnly
          placeholder="Type your text here"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
