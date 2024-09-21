"use client";

import { useTransition } from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleError } from "@/lib/utils";
import { achievementFormSchema } from "@/schemas/profile-schemas";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";
import SelectControl from "@/components/form-controls/select-control";
import DateControl from "@/components/form-controls/date-control";
import TextAreaControl from "@/components/form-controls/text-area-control";

type AchievementFormValuesType = z.infer<typeof achievementFormSchema>;

const defaultValues: AchievementFormValuesType = {
  title: "",
  category: "",
  date: "",
  affiliatedWith: "",
  description: "",
};

type ManageAchievementFormProps = {
  editAchievement?: Doc<"achievements">;
};

export default function ManageAchievementForm({
  editAchievement,
}: ManageAchievementFormProps) {
  const [isPending, startTransition] = useTransition();
  const createAchievement = useMutation(api.achievements.createAchievement);
  const updateAchievement = useMutation(api.achievements.updateAchievement);
  const { handleClose } = useModalStore();

  let newDefaultValues = defaultValues;

  if (editAchievement) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof AchievementFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => [
        key,
        editAchievement[key] || defaultValues[key],
      ]),
    ) as AchievementFormValuesType;
  }

  const achievementForm = useForm<AchievementFormValuesType>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: newDefaultValues,
  });

  function handleAchievementSubmit({
    category,
    ...restValues
  }: AchievementFormValuesType) {
    startTransition(async () => {
      if (editAchievement) {
        try {
          await updateAchievement({
            ...restValues,
            category: category as Doc<"achievements">["category"],
            achievementId: editAchievement._id,
          });

          toast.success("Achievement has been successfully updated.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      } else {
        try {
          await createAchievement({
            ...restValues,
            category: category as Doc<"achievements">["category"],
          });

          toast.success("Achievement has been successfully created.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      }
    });
  }

  return (
    <Form {...achievementForm}>
      <form
        className="space-y-4"
        onSubmit={achievementForm.handleSubmit(handleAchievementSubmit)}
        noValidate
      >
        <InputControl
          control={achievementForm.control}
          name="title"
          label="Title"
          placeholder="Enter title"
          disabled={isPending}
        />
        <SelectControl
          control={achievementForm.control}
          name="category"
          label="Category"
          placeholder="Choose a category"
          items={Object.values([
            "Academic",
            "Professional",
            "Personal",
          ] as Doc<"achievements">["category"][]).map((category) => ({
            label: category,
            value: category,
          }))}
          disabled={isPending}
        />
        <DateControl
          control={achievementForm.control}
          name="date"
          label="Date"
          placeholder="Pick a date"
          disabled={isPending}
        />
        <InputControl
          control={achievementForm.control}
          name="affiliatedWith"
          label="Affiliated with"
          placeholder="Enter affiliation information"
          disabled={isPending}
        />
        <TextAreaControl
          className="resize-none"
          control={achievementForm.control}
          name="description"
          label="Description"
          placeholder="Summarize your achievement"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
