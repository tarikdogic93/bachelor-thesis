"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { Sprout } from "lucide-react";

import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import Skill from "@/components/contents/skill";
import AddSkill from "@/components/contents/add-skill";

type SkillContentProps = {
  user?: Doc<"users">;
  handleSelectSkill?: (skill: Doc<"skills">) => void;
  viewOnly?: boolean;
};

export default function SkillContent({
  user,
  handleSelectSkill,
  viewOnly,
}: SkillContentProps) {
  const skills = useQuery(
    api.skills.getSkills,
    user ? { userId: user._id } : {},
  );
  const [prevSkillsLength, setPrevSkillsLength] = useState(0);
  const scrollAreaContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skills) {
      if (skills.length > prevSkillsLength && prevSkillsLength !== 0) {
        if (scrollAreaContentRef.current) {
          scrollAreaContentRef.current.scrollIntoView(false);
        }
      }

      setPrevSkillsLength(skills.length);
    }
  }, [skills, prevSkillsLength]);

  return (
    <div
      className={cn(
        "flex w-[318px] flex-col items-center gap-y-3 sm:w-[500px]",
        {
          "w-full": !!viewOnly,
        },
      )}
    >
      {skills ? (
        skills.length === 0 ? (
          viewOnly && (
            <div className="flex items-center gap-x-2 text-muted-foreground">
              <Sprout className="h-5 w-5 shrink-0" />
              <p>No skills found.</p>
            </div>
          )
        ) : (
          <ScrollArea
            className="w-full px-6"
            classNameViewport="max-h-[300px] sm:max-h-72"
          >
            <div
              className="flex flex-col items-center justify-center gap-y-3"
              ref={scrollAreaContentRef}
            >
              {skills.map((skill) => (
                <Skill
                  key={skill._id}
                  skill={skill}
                  handleSelectSkill={handleSelectSkill}
                  viewOnly={viewOnly}
                />
              ))}
            </div>
          </ScrollArea>
        )
      ) : (
        <Spinner type="circular" size="icon" />
      )}
      {!viewOnly && <AddSkill />}
    </div>
  );
}
