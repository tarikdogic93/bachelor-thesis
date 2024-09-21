"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { Presentation } from "lucide-react";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import Project from "@/components/contents/project";
import AddProject from "@/components/contents/add-project";

type ProjectContentProps = {
  user?: Doc<"users">;
  handleSelectProject?: (project: Doc<"projects">) => void;
  viewOnly?: boolean;
};

export default function ProjectContent({
  user,
  handleSelectProject,
  viewOnly,
}: ProjectContentProps) {
  const projects = useQuery(
    api.projects.getProjects,
    user ? { userId: user._id } : {},
  );
  const [prevProjectsLength, setPrevProjectsLength] = useState(0);
  const scrollAreaContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projects) {
      if (projects.length > prevProjectsLength && prevProjectsLength !== 0) {
        if (scrollAreaContentRef.current) {
          scrollAreaContentRef.current.scrollIntoView(false);
        }
      }

      setPrevProjectsLength(projects.length);
    }
  }, [projects, prevProjectsLength]);

  return (
    <div
      className={cn(
        "flex w-[318px] flex-col items-center gap-y-3 sm:w-[500px]",
        {
          "w-full": !!viewOnly,
        },
      )}
    >
      {projects ? (
        projects.length === 0 ? (
          viewOnly && (
            <div className="flex items-center gap-x-2 text-muted-foreground">
              <Presentation className="h-5 w-5 shrink-0" />
              <p>No projects found.</p>
            </div>
          )
        ) : (
          <ScrollArea
            className="w-full px-6"
            classNameViewport="max-h-[350px] sm:max-h-72"
          >
            <div
              className="flex flex-col items-center justify-center gap-y-3"
              ref={scrollAreaContentRef}
            >
              {projects.map((project) => (
                <Project
                  key={project._id}
                  project={project}
                  handleSelectProject={handleSelectProject}
                  viewOnly={viewOnly}
                />
              ))}
            </div>
          </ScrollArea>
        )
      ) : (
        <Spinner type="circular" size="icon" />
      )}
      {!viewOnly && <AddProject />}
    </div>
  );
}
