"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSONContent } from "@tiptap/react";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { managePostFormSchema } from "@/schemas/forum-schemas";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import TipTap from "@/components/ui/tip-tap";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";

type ManagePostFormValuesType = z.infer<typeof managePostFormSchema>;

const defaultValues: ManagePostFormValuesType = {
  title: "",
};

type ManagePostFormProps = {
  thread: Doc<"threads">;
  editPost?: Doc<"posts">;
};

export default function ManagePostForm({
  thread,
  editPost,
}: ManagePostFormProps) {
  const [isPending, startTransition] = useTransition();
  const [contentJSON, setContentJSON] = useState<JSONContent>();
  const createPost = useMutation(api.posts.createPost);
  const updatePost = useMutation(api.posts.updatePost);
  const { handleClose } = useModalStore();

  let newDefaultValues = defaultValues;

  if (editPost) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof ManagePostFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => [key, editPost[key] || defaultValues[key]]),
    ) as ManagePostFormValuesType;
  }

  const managePostForm = useForm<ManagePostFormValuesType>({
    resolver: zodResolver(managePostFormSchema),
    defaultValues: newDefaultValues,
  });

  function handleManagePost(values: ManagePostFormValuesType) {
    startTransition(async () => {
      if (editPost) {
        try {
          await updatePost({
            ...values,
            content: JSON.stringify(contentJSON),
            postId: editPost._id,
          });

          toast.success("Post has been successfully updated.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      } else {
        try {
          await createPost({
            ...values,
            content: JSON.stringify(contentJSON),
            threadId: thread._id,
          });

          toast.success("Post has been successfully created.");

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      }
    });
  }

  return (
    <Form {...managePostForm}>
      <form
        className="space-y-4"
        onSubmit={managePostForm.handleSubmit(handleManagePost)}
        noValidate
      >
        <InputControl
          control={managePostForm.control}
          name="title"
          label="Title"
          placeholder="Enter title"
          disabled={isPending}
        />
        <TipTap
          contentJSON={
            (editPost && editPost.content && JSON.parse(editPost.content)) ||
            contentJSON
          }
          setContentJSON={setContentJSON}
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
