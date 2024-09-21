"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleError } from "@/lib/utils";
import { projectFormSchema } from "@/schemas/profile-schemas";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";
import SelectControl from "@/components/form-controls/select-control";
import DateControl from "@/components/form-controls/date-control";
import CheckboxControl from "@/components/form-controls/checkbox-control";
import TextAreaControl from "@/components/form-controls/text-area-control";

type ProjectFormValuesType = z.infer<typeof projectFormSchema>;

const defaultValues: ProjectFormValuesType = {
  title: "",
  category: "",
  startDate: "",
  endDate: "",
  isOngoing: false,
  numberOfPeople: "",
  priceRangeMin: "",
  priceRangeMax: "",
  description: "",
  image: undefined,
};

type ManageProjectFormProps = {
  editProject?: Doc<"projects">;
};

export default function ManageProjectForm({
  editProject,
}: ManageProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createProject = useMutation(api.projects.createProject);
  const updateProject = useMutation(api.projects.updateProject);
  const removeProjectImage = useMutation(api.projects.removeProjectImage);
  const [isProjectImageRemoving, setIsProjectImageRemoving] = useState(false);
  const { handleClose } = useModalStore();

  let newDefaultValues = defaultValues;

  if (editProject) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof ProjectFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => {
        if (key === "isOngoing") {
          return [key, editProject.isOngoing];
        }

        if (key === "numberOfPeople") {
          return [
            key,
            editProject.numberOfPeople?.toString() || defaultValues[key],
          ];
        }

        if (key === "priceRangeMin") {
          return [
            key,
            editProject.priceRangeMin?.toString() || defaultValues[key],
          ];
        }

        if (key === "priceRangeMax") {
          return [
            key,
            editProject.priceRangeMax?.toString() || defaultValues[key],
          ];
        }

        if (key === "image") {
          return [key, defaultValues[key]];
        }

        return [key, editProject[key] || defaultValues[key]];
      }),
    ) as ProjectFormValuesType;
  }

  const projectForm = useForm<ProjectFormValuesType>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: newDefaultValues,
  });

  async function handleRemoveProjectImage() {
    if (editProject) {
      try {
        setIsProjectImageRemoving(true);

        await removeProjectImage({ projectId: editProject._id });

        editProject.image = undefined;
      } catch (error) {
        toast.error(handleError(error));
      } finally {
        setIsProjectImageRemoving(false);
      }
    }
  }

  function handleProjectSubmit({
    category,
    numberOfPeople,
    priceRangeMin,
    priceRangeMax,
    image,
    ...restValues
  }: ProjectFormValuesType) {
    startTransition(async () => {
      let project: Omit<Doc<"projects">, "_id" | "_creationTime" | "userId"> = {
        ...restValues,
        category: category as Doc<"projects">["category"],
        numberOfPeople: numberOfPeople ? Number(numberOfPeople) : undefined,
        priceRangeMin: priceRangeMin ? Number(priceRangeMin) : undefined,
        priceRangeMax: priceRangeMax ? Number(priceRangeMax) : undefined,
        image: undefined,
      };
      let uploadUrl: string;
      let response: Response;

      if (image) {
        uploadUrl = await generateUploadUrl();

        response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (response.ok) {
          const { storageId } = await response.json();

          project = {
            ...project,
            image: { name: image.name, type: image.type, url: storageId },
          };
        }
      }

      if (editProject) {
        try {
          await updateProject({ ...project, projectId: editProject._id });

          toast.success("Project has been successfully updated.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      } else {
        try {
          await createProject(project);

          toast.success("Project has been successfully created.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      }
    });
  }

  return (
    <Form {...projectForm}>
      <form
        className="space-y-4"
        onSubmit={projectForm.handleSubmit(handleProjectSubmit)}
        noValidate
      >
        <InputControl
          control={projectForm.control}
          name="title"
          label="Title"
          placeholder="Enter title"
          disabled={isPending}
        />
        <SelectControl
          control={projectForm.control}
          name="category"
          label="Category"
          placeholder="Choose a category"
          items={Object.values([
            "Web development",
            "Mobile app development",
            "Desktop app development",
            "Game development",
            "Database management system",
            "Content management system",
            "E-commerce platform development",
            "Artificial intelligence",
            "DevOps tools",
            "Cloud computing",
          ] as Doc<"projects">["category"][]).map((category) => ({
            label: category,
            value: category,
          }))}
          disabled={isPending}
        />
        <DateControl
          control={projectForm.control}
          name="startDate"
          label="Start date"
          placeholder="Pick a date"
          trigger={() => projectForm.trigger(["startDate", "endDate"])}
          disabled={isPending}
        />
        <DateControl
          control={projectForm.control}
          name="endDate"
          label="End date"
          placeholder="Pick a date"
          trigger={() => projectForm.trigger(["startDate", "endDate"])}
          disabled={projectForm.getValues().isOngoing || isPending}
        />
        <CheckboxControl
          control={projectForm.control}
          name="isOngoing"
          label="Check the box if the project is still ongoing"
          trigger={() => projectForm.trigger(["startDate", "endDate"])}
          disabled={isPending}
        />
        <InputControl
          control={projectForm.control}
          type="number"
          step={1}
          min={1}
          name="numberOfPeople"
          label="Number of people on the project"
          placeholder="Enter number of people"
          disabled={isPending}
        />
        <InputControl
          control={projectForm.control}
          type="number"
          step={1}
          min={1}
          name="priceRangeMin"
          label="Minimum received price (USD)"
          trigger={() =>
            projectForm.trigger(["priceRangeMin", "priceRangeMax"])
          }
          placeholder="Enter min price"
          disabled={isPending}
        />
        <InputControl
          control={projectForm.control}
          type="number"
          step={1}
          min={1}
          name="priceRangeMax"
          label="Maximum received price (USD)"
          trigger={() =>
            projectForm.trigger(["priceRangeMin", "priceRangeMax"])
          }
          placeholder="Enter max price"
          disabled={isPending}
        />
        {editProject?.image ? (
          <div className="group relative aspect-square w-1/2">
            <Image
              className="rounded-md object-cover"
              src={editProject.image.url}
              alt="Project image"
              fill
            />
            <Button
              className="absolute -right-2 -top-2 hidden h-6 w-6 cursor-pointer rounded-full disabled:opacity-80 group-hover:flex"
              variant="destructive"
              size="icon"
              disabled={isProjectImageRemoving}
              onClick={handleRemoveProjectImage}
            >
              <X className="h-5 w-5 shrink-0" />
            </Button>
          </div>
        ) : (
          <InputControl
            control={projectForm.control}
            type="file"
            name="image"
            label="Upload image"
            accept="image/*"
            disabled={isPending}
          />
        )}
        <TextAreaControl
          className="resize-none"
          control={projectForm.control}
          name="description"
          label="Description"
          placeholder="Summarize your project"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
