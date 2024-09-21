"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { Flag } from "lucide-react";

import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import Experience from "@/components/contents/experience";
import AddExperience from "@/components/contents/add-experience";

type ExperienceContentProps = {
  user?: Doc<"users">;
  handleSelectExperience?: (experience: Doc<"experiences">) => void;
  viewOnly?: boolean;
};

export default function ExperienceContent({
  user,
  handleSelectExperience,
  viewOnly,
}: ExperienceContentProps) {
  const experiences = useQuery(
    api.experiences.getExperiences,
    user ? { userId: user._id } : {},
  );
  const [prevExperiencesLength, setPrevExperiencesLength] = useState(0);
  const scrollAreaContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (experiences) {
      if (
        experiences.length > prevExperiencesLength &&
        prevExperiencesLength !== 0
      ) {
        if (scrollAreaContentRef.current) {
          scrollAreaContentRef.current.scrollIntoView(false);
        }
      }

      setPrevExperiencesLength(experiences.length);
    }
  }, [experiences, prevExperiencesLength]);

  return (
    <div
      className={cn(
        "flex w-[318px] flex-col items-center gap-y-3 sm:w-[500px]",
        {
          "w-full": !!viewOnly,
        },
      )}
    >
      {experiences ? (
        experiences.length === 0 ? (
          viewOnly && (
            <div className="flex items-center gap-x-2 text-muted-foreground">
              <Flag className="h-5 w-5 shrink-0" />
              <p>No experiences found.</p>
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
              {experiences.map((experience) => (
                <Experience
                  key={experience._id}
                  experience={experience}
                  handleSelectExperience={handleSelectExperience}
                  viewOnly={viewOnly}
                />
              ))}
            </div>
          </ScrollArea>
        )
      ) : (
        <Spinner type="circular" size="icon" />
      )}
      {!viewOnly && <AddExperience />}
    </div>
  );
}
