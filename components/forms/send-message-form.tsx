"use client";

import { useEffect, useTransition } from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { Send, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { sendMessageFormSchema } from "@/schemas/chat-schemas";
import { useChatStore } from "@/stores/use-chat-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import TextAreaControl from "@/components/form-controls/text-area-control";

type SendMessageFormValuesType = z.infer<typeof sendMessageFormSchema>;

const defaultValues: SendMessageFormValuesType = {
  text: "",
};

type SendMessageFormProps = {
  conversation: Doc<"conversations"> & {
    users: (Doc<"users"> | null)[];
  };
};

export default function SendMessageForm({
  conversation,
}: SendMessageFormProps) {
  const [isPending, startTransition] = useTransition();
  const { editMessage, resetEditMessage } = useChatStore();
  const matchesMdMediaQuery = useMediaQuery("(min-width: 768px)");
  const createMessage = useMutation(api.messages.createMessage);
  const updateMessage = useMutation(api.messages.updateMessage);

  const sendMessageForm = useForm<SendMessageFormValuesType>({
    resolver: zodResolver(sendMessageFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editMessage) {
      sendMessageForm.reset({ text: editMessage.text });
    } else {
      sendMessageForm.reset({ ...defaultValues });
    }
  }, [editMessage, sendMessageForm]);

  function handleMessageSubmit(values: SendMessageFormValuesType) {
    startTransition(async () => {
      if (editMessage) {
        try {
          await updateMessage({
            ...values,
            messageId: editMessage._id,
          });

          sendMessageForm.reset({ ...defaultValues });

          resetEditMessage();
        } catch (error) {
          toast.error(handleError(error));
        }
      } else {
        try {
          await createMessage({
            ...values,
            conversationId: conversation._id,
          });

          sendMessageForm.reset({ ...defaultValues });
        } catch (error) {
          toast.error(handleError(error));
        }
      }
    });
  }

  return (
    <Form {...sendMessageForm}>
      <form
        className="relative space-y-4"
        onSubmit={sendMessageForm.handleSubmit(handleMessageSubmit)}
        noValidate
      >
        <TextAreaControl
          className="min-h-14 resize-none border-0 px-3 py-0 shadow-none md:min-h-20"
          control={sendMessageForm.control}
          name="text"
          label="Text"
          labelSrOnly
          placeholder="Type your message here"
          disabled={isPending}
        />
        {editMessage && (
          <Button
            className="absolute -top-10 left-2 h-5 gap-x-1 rounded-full text-xs hover:bg-secondary"
            variant="secondary"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();

              sendMessageForm.reset({ ...defaultValues });

              resetEditMessage();
            }}
          >
            <span>Edit message</span>
            <X className="h-4 w-4 shrink-0" />
          </Button>
        )}
        <div className="px-3">
          {isPending ? (
            <LoadingButton className="h-9 gap-x-2" text="Sending..." />
          ) : (
            <Button className="h-9 w-9 gap-x-2 md:w-fit" type="submit">
              <Send className="h-[18px] w-[18px] shrink-0" />
              <span className="hidden md:block">Send message</span>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
