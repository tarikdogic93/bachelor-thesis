"use client";

import { useModalStore } from "@/stores/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";

export default function JobRejectionInfoModal() {
  const { type, data, handleClose } = useModalStore();

  const rejectionReason = data?.rejectionReason;

  return (
    <Modal
      title="Job rejection insight"
      description="Discover the detailed reasons behind your job application rejection"
      isOpen={type === "jobRejectionInfo"}
      handleClose={handleClose}
    >
      {rejectionReason && (
        <div className="rounded-md border px-0 py-6">
          <ScrollArea
            className="h-full w-full px-6"
            classNameViewport="max-h-72"
          >
            <p className="text-sm text-muted-foreground">{rejectionReason}</p>
          </ScrollArea>
        </div>
      )}
    </Modal>
  );
}
