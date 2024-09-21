"use client";

import { useTransition } from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleError } from "@/lib/utils";
import { countries } from "@/data/countries-data";
import { experienceFormSchema } from "@/schemas/profile-schemas";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";
import CommandControl from "@/components/form-controls/command-control";
import SelectControl from "@/components/form-controls/select-control";
import DateControl from "@/components/form-controls/date-control";
import CheckboxControl from "@/components/form-controls/checkbox-control";
import TextAreaControl from "@/components/form-controls/text-area-control";

type ExperienceFormValuesType = z.infer<typeof experienceFormSchema>;

const defaultValues: ExperienceFormValuesType = {
  title: "",
  establishment: "",
  category: "",
  startDate: "",
  endDate: "",
  isOngoing: false,
  country: "",
  city: "",
  settingType: "",
  description: "",
};

type ManageExperienceFormProps = {
  editExperience?: Doc<"experiences">;
};

export default function ManageExperienceForm({
  editExperience,
}: ManageExperienceFormProps) {
  const [isPending, startTransition] = useTransition();
  const createExperience = useMutation(api.experiences.createExperience);
  const updateExperience = useMutation(api.experiences.updateExperience);
  const { handleClose } = useModalStore();

  let newDefaultValues = defaultValues;

  if (editExperience) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof ExperienceFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => {
        if (key === "country") {
          return [key, editExperience[key]?.name || defaultValues[key]];
        }

        if (key === "isOngoing") {
          return [key, editExperience.isOngoing];
        }

        return [key, editExperience[key] || defaultValues[key]];
      }),
    ) as ExperienceFormValuesType;
  }

  const experienceForm = useForm<ExperienceFormValuesType>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: newDefaultValues,
  });

  function handleExperienceSubmit({
    category,
    country,
    settingType,
    ...restValues
  }: ExperienceFormValuesType) {
    startTransition(async () => {
      const alpha3Code = countries.find(
        (obj) => obj.name === country,
      )?.alpha3Code;

      if (editExperience) {
        try {
          await updateExperience({
            ...restValues,
            category: category as Doc<"experiences">["category"],
            country:
              country && alpha3Code ? { name: country, alpha3Code } : undefined,
            settingType: settingType as Doc<"experiences">["settingType"],
            experienceId: editExperience._id,
          });

          toast.success("Experience has been successfully updated.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      } else {
        try {
          await createExperience({
            ...restValues,
            country:
              country && alpha3Code ? { name: country, alpha3Code } : undefined,
            category: category as Doc<"experiences">["category"],
            settingType: settingType as Doc<"experiences">["settingType"],
          });

          toast.success("Experience has been successfully created.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      }
    });
  }

  return (
    <Form {...experienceForm}>
      <form
        className="space-y-4"
        onSubmit={experienceForm.handleSubmit(handleExperienceSubmit)}
        noValidate
      >
        <InputControl
          control={experienceForm.control}
          name="title"
          label="Title"
          placeholder="Enter title"
          disabled={isPending}
        />
        <InputControl
          control={experienceForm.control}
          name="establishment"
          label="Establishment"
          placeholder="Enter establishment name"
          disabled={isPending}
        />
        <SelectControl
          control={experienceForm.control}
          name="category"
          label="Category"
          placeholder="Choose a category"
          items={Object.values([
            "Education",
            "Certification",
            "Competition",
            "Internship",
            "Volunteer",
            "Freelance",
            "Work",
            "Research",
            "Entrepreneurial",
          ] as Doc<"experiences">["category"][]).map((category) => ({
            label: category,
            value: category,
          }))}
          disabled={isPending}
        />
        <DateControl
          control={experienceForm.control}
          name="startDate"
          label="Start date"
          placeholder="Pick a date"
          trigger={() => experienceForm.trigger(["startDate", "endDate"])}
          disabled={isPending}
        />
        <DateControl
          control={experienceForm.control}
          name="endDate"
          label="End date"
          placeholder="Pick a date"
          trigger={() => experienceForm.trigger(["startDate", "endDate"])}
          disabled={experienceForm.getValues().isOngoing || isPending}
        />
        <CheckboxControl
          control={experienceForm.control}
          name="isOngoing"
          label="Check the box if the experience is still ongoing"
          trigger={() => experienceForm.trigger(["startDate", "endDate"])}
          disabled={isPending}
        />
        <CommandControl
          control={experienceForm.control}
          name="country"
          label="Country"
          items={countries.map((country) => country.name)}
          placeholder="Choose a country"
          trigger={() => experienceForm.trigger("country")}
          disabled={
            experienceForm.getValues().settingType === "Remote" || isPending
          }
        />
        <InputControl
          control={experienceForm.control}
          name="city"
          label="City"
          placeholder="Enter city"
          trigger={() => experienceForm.trigger("city")}
          disabled={
            experienceForm.getValues().settingType === "Remote" || isPending
          }
        />
        <SelectControl
          control={experienceForm.control}
          name="settingType"
          label="Setting type"
          placeholder="Choose a setting type"
          items={Object.values([
            "Onsite",
            "Hybrid",
            "Remote",
          ] as Doc<"experiences">["settingType"][]).map((type) => ({
            label: type,
            value: type,
          }))}
          trigger={() => experienceForm.trigger(["country", "city"])}
          disabled={isPending}
        />
        <TextAreaControl
          className="resize-none"
          control={experienceForm.control}
          name="description"
          label="Description"
          placeholder="Summarize your experience"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
