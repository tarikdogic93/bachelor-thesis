"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { manageCommentFormSchema } from "@/schemas/forum-schemas";
import { useModalStore } from "@/stores/use-modal-store";
import { useForumStore } from "@/stores/use-forum-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import TextAreaControl from "@/components/form-controls/text-area-control";

type ManageCommentFormValuesType = z.infer<typeof manageCommentFormSchema>;

const defaultValues: ManageCommentFormValuesType = {
  text: "",
};

type ManageCommentFormProps = {
  post: Doc<"posts">;
  editComment?: Doc<"comments">;
  replyComment?: Doc<"comments">;
};

export default function ManageCommentForm({
  post,
  editComment,
  replyComment,
}: ManageCommentFormProps) {
  const [isPending, startTransition] = useTransition();
  const { handleClose } = useModalStore();
  const { expandFlattenedComment } = useForumStore();
  const createComment = useMutation(api.comments.createComment);
  const updateComment = useMutation(api.comments.updateComment);

  let newDefaultValues = defaultValues;

  if (editComment) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof ManageCommentFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => [key, editComment[key] || defaultValues[key]]),
    ) as ManageCommentFormValuesType;
  }

  const manageCommentForm = useForm<ManageCommentFormValuesType>({
    resolver: zodResolver(manageCommentFormSchema),
    defaultValues: newDefaultValues,
  });

  function handleCommentSubmit(values: ManageCommentFormValuesType) {
    startTransition(async () => {
      if (editComment) {
        try {
          await updateComment({
            ...values,
            commentId: editComment._id,
          });

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      } else if (replyComment) {
        try {
          await createComment({
            ...values,
            postId: post._id,
            parentCommentId: replyComment._id,
          });

          expandFlattenedComment(replyComment._id);

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      } else {
        try {
          await createComment({
            ...values,
            postId: post._id,
          });

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      }
    });
  }

  return (
    <Form {...manageCommentForm}>
      <form
        className="space-y-4"
        onSubmit={manageCommentForm.handleSubmit(handleCommentSubmit)}
        noValidate
      >
        <TextAreaControl
          className="resize-none"
          control={manageCommentForm.control}
          name="text"
          label="Comment"
          labelSrOnly
          placeholder="Type your text here"
          disabled={isPending}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
