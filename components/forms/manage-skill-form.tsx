"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleError } from "@/lib/utils";
import { skillFormSchema } from "@/schemas/profile-schemas";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";
import SliderControl from "@/components/form-controls/slider-control";
import TextAreaControl from "@/components/form-controls/text-area-control";

type SkillFormValuesType = z.infer<typeof skillFormSchema>;

const defaultValues: SkillFormValuesType = {
  name: "",
  rating: 0,
  description: "",
};

type ManageSkillFormProps = {
  editSkill?: Doc<"skills">;
};

export default function ManageSkillForm({ editSkill }: ManageSkillFormProps) {
  const [isPending, startTransition] = useTransition();
  const createSkill = useMutation(api.skills.createSkill);
  const updateSkill = useMutation(api.skills.updateSkill);
  const { handleClose } = useModalStore();

  let newDefaultValues = defaultValues;

  if (editSkill) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof SkillFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => [key, editSkill[key] || defaultValues[key]]),
    ) as SkillFormValuesType;
  }

  const skillForm = useForm<SkillFormValuesType>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: newDefaultValues,
  });

  function handleSkillSubmit(values: SkillFormValuesType) {
    startTransition(async () => {
      if (editSkill) {
        try {
          await updateSkill({
            ...values,
            skillId: editSkill._id,
          });

          toast.success("Skill has been successfully updated.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      } else {
        try {
          await createSkill({
            ...values,
          });

          toast.success("Skill has been successfully created.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      }
    });
  }

  return (
    <Form {...skillForm}>
      <form
        className="space-y-4"
        onSubmit={skillForm.handleSubmit(handleSkillSubmit)}
        noValidate
      >
        <InputControl
          control={skillForm.control}
          name="name"
          label="Name"
          placeholder="Enter name"
          disabled={isPending}
        />
        <SliderControl
          control={skillForm.control}
          name="rating"
          label="Rating"
          min={0}
          max={10}
          step={1}
          disabled={isPending}
        />
        <TextAreaControl
          className="resize-none"
          control={skillForm.control}
          name="description"
          label="Description"
          placeholder="Summarize your skill"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
