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
import { threadFormSchema } from "@/schemas/forum-schemas";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";
import TextAreaControl from "@/components/form-controls/text-area-control";

type ManageThreadFormProps = {
  editThread?: Doc<"threads">;
};

type ThreadFormValuesType = z.infer<typeof threadFormSchema>;

const defaultValues: ThreadFormValuesType = {
  title: "",
  image: undefined,
  description: "",
};

export default function ManageThreadForm({
  editThread,
}: ManageThreadFormProps) {
  const [isPending, startTransition] = useTransition();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createThread = useMutation(api.threads.createThread);
  const updateThread = useMutation(api.threads.updateThread);
  const removeThreadImage = useMutation(api.threads.removeThreadImage);
  const [isThreadImageRemoving, setIsThreadImageRemoving] = useState(false);
  const { handleClose } = useModalStore();

  let newDefaultValues = defaultValues;

  if (editThread) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof ThreadFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => {
        if (key === "image") {
          return [key, defaultValues[key]];
        }

        return [key, editThread[key] || defaultValues[key]];
      }),
    ) as ThreadFormValuesType;
  }

  const threadForm = useForm<ThreadFormValuesType>({
    resolver: zodResolver(threadFormSchema),
    defaultValues: newDefaultValues,
  });

  async function handleRemoveThreadImage() {
    if (editThread) {
      try {
        setIsThreadImageRemoving(true);

        await removeThreadImage({ threadId: editThread._id });

        editThread.image = undefined;
      } catch (error) {
        toast.error(handleError(error));
      } finally {
        setIsThreadImageRemoving(false);
      }
    }
  }

  function handleThreadSubmit({ image, ...restValues }: ThreadFormValuesType) {
    startTransition(async () => {
      let thread: Omit<
        Doc<"threads">,
        "_id" | "_creationTime" | "userId" | "memberIds"
      > = {
        ...restValues,
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

          thread = {
            ...thread,
            image: { name: image.name, type: image.type, url: storageId },
          };
        }
      }

      if (editThread) {
        try {
          await updateThread({
            ...thread,
            threadId: editThread._id,
          });

          toast.success("Thread has been successfully updated.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      } else {
        try {
          await createThread(thread);

          toast.success("Thread has been successfully created.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      }
    });
  }

  return (
    <Form {...threadForm}>
      <form
        className="space-y-4"
        onSubmit={threadForm.handleSubmit(handleThreadSubmit)}
        noValidate
      >
        <InputControl
          control={threadForm.control}
          name="title"
          label="Title"
          placeholder="Enter title"
          disabled={isPending}
        />
        {editThread?.image ? (
          <div className="group relative h-40 w-1/2">
            <Image
              className="rounded-md object-cover"
              src={editThread.image.url}
              alt="Thread image"
              fill
            />
            <Button
              className="absolute -right-2 -top-2 hidden h-6 w-6 cursor-pointer rounded-full disabled:opacity-80 group-hover:flex"
              variant="destructive"
              size="icon"
              disabled={isThreadImageRemoving}
              onClick={handleRemoveThreadImage}
            >
              <X className="h-5 w-5 shrink-0" />
            </Button>
          </div>
        ) : (
          <InputControl
            control={threadForm.control}
            type="file"
            name="image"
            label="Upload image"
            accept="image/*"
            disabled={isPending}
          />
        )}
        <TextAreaControl
          className="resize-none"
          control={threadForm.control}
          name="description"
          label="Description"
          placeholder="Summarize your thread"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
