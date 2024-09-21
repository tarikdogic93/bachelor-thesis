import { format } from "date-fns";
import { useMediaQuery } from "usehooks-ts";
import { LucideIcon, VenetianMask } from "lucide-react";

import { projects } from "@/data/projects-data";
import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import Hint from "@/components/ui/hint";
import ProjectOptions from "@/components/contents/project-options";

type ProjectProps = {
  project: Doc<"projects">;
  handleSelectProject?: (project: Doc<"projects">) => void;
  viewOnly?: boolean;
};

export default function Project({
  project,
  handleSelectProject,
  viewOnly,
}: ProjectProps) {
  const matchesSmMediaQuery = useMediaQuery("(min-width: 640px)");

  const foundProject = projects.find(
    (obj) => obj.category === project.category,
  );

  const Icon: LucideIcon = foundProject?.icon || VenetianMask;

  return (
    <Card className="w-full bg-muted/20">
      <CardContent className="flex flex-col items-center justify-between gap-y-3 p-4 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-y-1 sm:flex-row sm:gap-x-4">
          <Hint
            side={matchesSmMediaQuery ? "left" : "top"}
            sideOffset={10}
            label={`${project.category} project`}
          >
            <div className="rounded-full bg-from/80 p-3">
              <Icon className="h-6 w-6 shrink-0 text-white" />
            </div>
          </Hint>
          <div className="flex w-full flex-col items-center gap-y-0 sm:items-start sm:gap-y-2">
            <p className="max-w-56 truncate">{project.title}</p>
            <p className="max-w-56 truncate text-sm">
              {format(project.startDate, "PPP")} -{" "}
              {project.endDate ? format(project.endDate, "PPP") : "Present"}
            </p>
          </div>
        </div>
        <ProjectOptions
          project={project}
          handleSelectProject={handleSelectProject}
          viewOnly={viewOnly}
        />
      </CardContent>
    </Card>
  );
}
