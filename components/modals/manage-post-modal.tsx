"use client";

import { useModalStore } from "@/stores/use-modal-store";
import { useForumStore } from "@/stores/use-forum-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";
import ManagePostForm from "@/components/forms/manage-post-form";

export default function ManagePostModal() {
  const { type, data, handleClose } = useModalStore();
  const { activeThread } = useForumStore();

  const post = data?.post;

  return (
    <Modal
      title="Manage posts"
      description="Take control of your posts, from creation to editing"
      isOpen={type === "managePost"}
      handleClose={handleClose}
    >
      {activeThread && (
        <div className="rounded-md border px-0 py-6">
          <ScrollArea
            className="h-full w-full px-6"
            classNameViewport="max-h-[290px]"
          >
            <ManagePostForm thread={activeThread} editPost={post} />
          </ScrollArea>
        </div>
      )}
    </Modal>
  );
}
