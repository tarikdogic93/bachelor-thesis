"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  Info,
  Pencil,
  Trash2,
} from "lucide-react";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";

type ProjectOptionsProps = {
  project: Doc<"projects">;
  handleSelectProject?: (project: Doc<"projects">) => void;
  viewOnly?: boolean;
};

export default function ProjectOptions({
  project,
  handleSelectProject,
  viewOnly,
}: ProjectOptionsProps) {
  const [isPending, startTransition] = useTransition();
  const deleteProject = useMutation(api.projects.deleteProject);
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const { handleOpen } = useModalStore();

  function handleProjectDelete() {
    startTransition(async () => {
      try {
        await deleteProject({ projectId: project._id });

        setAreOptionsVisible(false);
      } catch (error) {
        toast.error(handleError(error));
      }
    });
  }

  return (
    <div className="flex flex-row-reverse items-center gap-x-1 sm:flex-row">
      {areOptionsVisible && (
        <div className="flex items-center gap-x-1">
          <Button
            className="h-6 w-6 rounded-full"
            size="icon"
            disabled={isPending}
            onClick={() =>
              viewOnly && handleSelectProject
                ? handleSelectProject(project)
                : handleOpen("projectInfo", { project })
            }
          >
            <Info className="h-4 w-4 shrink-0" />
          </Button>
          {!viewOnly && (
            <Button
              className="h-6 w-6 rounded-full"
              variant="secondary"
              size="icon"
              disabled={isPending}
              onClick={() => handleOpen("manageProject", { project })}
            >
              <Pencil className="h-3.5 w-3.5 shrink-0" />
            </Button>
          )}
          {!viewOnly && (
            <Button
              className="h-6 w-6 rounded-full"
              variant="destructive"
              size="icon"
              disabled={isPending}
              onClick={handleProjectDelete}
            >
              <Trash2 className="h-4 w-4 shrink-0" />
            </Button>
          )}
        </div>
      )}
      <Button
        className="h-6 w-6 rounded-full"
        variant="outline"
        size="icon"
        onClick={() => setAreOptionsVisible(!areOptionsVisible)}
      >
        {areOptionsVisible ? (
          <ChevronsRightLeft className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronsLeftRight className="h-4 w-4 shrink-0" />
        )}
      </Button>
    </div>
  );
}
