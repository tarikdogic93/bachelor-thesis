"use client";

import { useTransition } from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { countries } from "@/data/countries-data";
import { handleError } from "@/lib/utils";
import { jobFormSchema } from "@/schemas/jobs-schemas";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";
import SelectControl from "@/components/form-controls/select-control";
import CommandControl from "@/components/form-controls/command-control";
import DateControl from "@/components/form-controls/date-control";
import TextAreaControl from "@/components/form-controls/text-area-control";
import MultiInputControl from "@/components/form-controls/multi-input-control";

type ManageJobFormProps = {
  editJob?: Doc<"jobs">;
};

type JobFormValuesType = z.infer<typeof jobFormSchema>;

const defaultValues: JobFormValuesType = {
  title: "",
  jobSector: "",
  jobType: "",
  country: "",
  city: "",
  settingType: "",
  salaryRangeMin: "",
  salaryRangeMax: "",
  benefits: [],
  educationLevel: "",
  experienceLevel: "",
  techStack: [],
  requirements: [],
  responsibilities: [],
  startDate: "",
  description: "",
};

export default function ManageJobForm({ editJob }: ManageJobFormProps) {
  const [isPending, startTransition] = useTransition();
  const { handleClose } = useModalStore();
  const createJob = useMutation(api.jobs.createJob);
  const updateJob = useMutation(api.jobs.updateJob);

  let newDefaultValues = defaultValues;

  if (editJob) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof JobFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => {
        if (key === "country") {
          return [key, editJob.country?.name || defaultValues[key]];
        }

        if (key === "salaryRangeMin") {
          return [key, editJob.salaryRangeMin.toString() || defaultValues[key]];
        }

        if (key === "salaryRangeMax") {
          return [key, editJob.salaryRangeMax.toString() || defaultValues[key]];
        }

        if (key === "benefits") {
          return [
            key,
            editJob.benefits.map((benefit) => ({ value: benefit })) ||
              defaultValues[key],
          ];
        }

        if (key === "techStack") {
          return [
            key,
            editJob.techStack.map((tech) => ({ value: tech })) ||
              defaultValues[key],
          ];
        }

        if (key === "requirements") {
          return [
            key,
            editJob.requirements.map((requirement) => ({
              value: requirement,
            })) || defaultValues[key],
          ];
        }

        if (key === "responsibilities") {
          return [
            key,
            editJob.responsibilities.map((responsibility) => ({
              value: responsibility,
            })) || defaultValues[key],
          ];
        }

        return [key, editJob[key] || defaultValues[key]];
      }),
    ) as JobFormValuesType;
  }

  const jobForm = useForm<JobFormValuesType>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: newDefaultValues,
  });

  function handleJobSubmit({
    jobSector,
    jobType,
    country,
    settingType,
    salaryRangeMin,
    salaryRangeMax,
    benefits,
    educationLevel,
    experienceLevel,
    techStack,
    requirements,
    responsibilities,
    ...restValues
  }: JobFormValuesType) {
    startTransition(async () => {
      const alpha3Code = countries.find(
        (obj) => obj.name === country,
      )?.alpha3Code;

      const job: Omit<
        Doc<"jobs">,
        | "_id"
        | "_creationTime"
        | "userId"
        | "companyName"
        | "applicationDeadline"
      > = {
        ...restValues,
        jobSector: jobSector as Doc<"jobs">["jobSector"],
        jobType: jobType as Doc<"jobs">["jobType"],
        country:
          country && alpha3Code ? { name: country, alpha3Code } : undefined,
        settingType: settingType as Doc<"jobs">["settingType"],
        salaryRangeMin: Number(salaryRangeMin),
        salaryRangeMax: Number(salaryRangeMax),
        benefits: benefits.map(({ value }) => value),
        educationLevel: educationLevel as Doc<"jobs">["educationLevel"],
        experienceLevel: experienceLevel as Doc<"jobs">["experienceLevel"],
        techStack: techStack.map(({ value }) => value),
        requirements: requirements.map(({ value }) => value),
        responsibilities: responsibilities.map(({ value }) => value),
      };

      if (editJob) {
        try {
          await updateJob({ jobId: editJob._id, ...job });

          toast.success("Job listing has been successfully updated.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      } else {
        try {
          await createJob(job);

          toast.success("Job listing has been successfully created.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      }
    });
  }

  return (
    <Form {...jobForm}>
      <form
        className="space-y-4"
        onSubmit={jobForm.handleSubmit(handleJobSubmit)}
        noValidate
      >
        <InputControl
          control={jobForm.control}
          name="title"
          label="Title"
          placeholder="Enter title"
          disabled={isPending}
        />
        <SelectControl
          control={jobForm.control}
          name="jobSector"
          label="Job sector"
          placeholder="Choose a job sector"
          items={Object.values([
            "Web development",
            "Mobile development",
            "Artificial intelligence",
            "DevOps engineering",
            "Cloud computing",
            "Other",
          ] as Doc<"jobs">["jobSector"][]).map((jobSector) => ({
            label: jobSector,
            value: jobSector,
          }))}
          disabled={isPending}
        />
        <SelectControl
          control={jobForm.control}
          name="jobType"
          label="Job type"
          placeholder="Choose a job type"
          items={Object.values([
            "Full-time",
            "Part-time",
            "Contract",
            "Internship",
          ] as Doc<"jobs">["jobType"][]).map((jobType) => ({
            label: jobType,
            value: jobType,
          }))}
          disabled={isPending}
        />
        <CommandControl
          control={jobForm.control}
          name="country"
          label="Country"
          items={countries.map((country) => country.name)}
          placeholder="Choose a country"
          trigger={() => jobForm.trigger("country")}
          disabled={jobForm.getValues().settingType === "Remote" || isPending}
        />
        <InputControl
          control={jobForm.control}
          name="city"
          label="City"
          placeholder="Enter city"
          trigger={() => jobForm.trigger("city")}
          disabled={jobForm.getValues().settingType === "Remote" || isPending}
        />
        <SelectControl
          control={jobForm.control}
          name="settingType"
          label="Setting type"
          placeholder="Choose a setting type"
          items={Object.values([
            "Onsite",
            "Hybrid",
            "Remote",
          ] as Doc<"jobs">["settingType"][]).map((settingType) => ({
            label: settingType,
            value: settingType,
          }))}
          trigger={() => jobForm.trigger(["country", "city"])}
          disabled={isPending}
        />
        <InputControl
          control={jobForm.control}
          type="number"
          step={1}
          min={1}
          name="salaryRangeMin"
          label="Minimum monthly salary (USD)"
          trigger={() => jobForm.trigger(["salaryRangeMin", "salaryRangeMax"])}
          placeholder="Enter min salary"
          disabled={isPending}
        />
        <InputControl
          control={jobForm.control}
          type="number"
          step={1}
          min={1}
          name="salaryRangeMax"
          label="Maximum monthly salary (USD)"
          trigger={() => jobForm.trigger(["salaryRangeMin", "salaryRangeMax"])}
          placeholder="Enter max salary"
          disabled={isPending}
        />
        <MultiInputControl
          control={jobForm.control}
          name="benefits"
          label="Benefits"
          placeholder="Enter benefit"
          buttonText="Add a benefit"
          disabled={isPending}
        />
        <SelectControl
          control={jobForm.control}
          name="educationLevel"
          label="Education level"
          placeholder="Choose an education level"
          items={Object.values([
            "High school diploma",
            "Associate degree",
            "Bachelor's degree",
            "Master's degree",
            "PhD",
          ] as Doc<"jobs">["educationLevel"][]).map((educationLevel) => ({
            label: educationLevel,
            value: educationLevel,
          }))}
          disabled={isPending}
        />
        <SelectControl
          control={jobForm.control}
          name="experienceLevel"
          label="Experience level"
          placeholder="Choose an experience level"
          items={Object.values([
            "Entry level",
            "Mid-level",
            "Senior level",
          ] as Doc<"jobs">["experienceLevel"][]).map((experienceLevel) => ({
            label: experienceLevel,
            value: experienceLevel,
          }))}
          trigger={() => jobForm.trigger(["country", "city"])}
          disabled={isPending}
        />
        <MultiInputControl
          control={jobForm.control}
          name="techStack"
          label="Tech stack"
          placeholder="Enter tech"
          buttonText="Add a tech"
          disabled={isPending}
        />
        <MultiInputControl
          control={jobForm.control}
          name="requirements"
          label="Job requirements"
          placeholder="Enter requirement"
          buttonText="Add a requirement"
          disabled={isPending}
        />
        <MultiInputControl
          control={jobForm.control}
          name="responsibilities"
          label="Job responsibilities"
          placeholder="Enter responsibility"
          buttonText="Add a responsibility"
          disabled={isPending}
        />
        <DateControl
          control={jobForm.control}
          name="startDate"
          label="Start date"
          placeholder="Pick a date"
          disabledPastDates
          disabled={isPending}
        />
        <TextAreaControl
          className="resize-none"
          control={jobForm.control}
          name="description"
          label="Description"
          placeholder="Summarize your job listing"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
