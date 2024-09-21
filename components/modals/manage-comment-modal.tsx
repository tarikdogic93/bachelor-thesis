"use client";

import { useModalStore } from "@/stores/use-modal-store";
import { useForumStore } from "@/stores/use-forum-store";
import Modal from "@/components/ui/modal";
import ManageCommentForm from "@/components/forms/manage-comment-form";

export default function ManageCommentModal() {
  const { type, data, handleClose } = useModalStore();
  const { activePost } = useForumStore();

  const editComment = data?.editComment;
  const replyComment = data?.replyComment;

  return (
    <Modal
      title="Manage comments"
      description="Add a new comment, edit an existing one, or reply"
      isOpen={type === "manageComment"}
      handleClose={handleClose}
    >
      {activePost && (
        <ManageCommentForm
          post={activePost}
          editComment={editComment}
          replyComment={replyComment}
        />
      )}
    </Modal>
  );
}
