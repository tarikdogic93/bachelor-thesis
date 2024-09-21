import { LucideIcon, VenetianMask } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { format } from "date-fns";

import { experiences } from "@/data/experiences-data";
import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import Hint from "@/components/ui/hint";
import ExperienceOptions from "@/components/contents/experience-options";

type ExperienceProps = {
  experience: Doc<"experiences">;
  handleSelectExperience?: (experience: Doc<"experiences">) => void;
  viewOnly?: boolean;
};

export default function Experience({
  experience,
  handleSelectExperience,
  viewOnly,
}: ExperienceProps) {
  const matchesSmMediaQuery = useMediaQuery("(min-width: 640px)");

  const foundExperience = experiences.find(
    (obj) => obj.category === experience.category,
  );

  const Icon: LucideIcon = foundExperience?.icon || VenetianMask;

  return (
    <Card className="w-full bg-muted/20">
      <CardContent className="flex flex-col items-center justify-between gap-y-3 p-4 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-y-1 sm:flex-row sm:gap-x-4">
          <Hint
            side={matchesSmMediaQuery ? "left" : "top"}
            sideOffset={10}
            label={`${experience.category} experience`}
          >
            <div className="rounded-full bg-from/80 p-3">
              <Icon className="h-6 w-6 shrink-0 text-white" />
            </div>
          </Hint>
          <div className="flex w-full flex-col items-center gap-y-0 sm:items-start sm:gap-y-2">
            <p className="max-w-56 truncate">{experience.title}</p>
            <p className="max-w-56 truncate text-sm">
              {format(experience.startDate, "PPP")} -{" "}
              {experience.endDate
                ? format(experience.endDate, "PPP")
                : "Present"}
            </p>
          </div>
        </div>
        <ExperienceOptions
          experience={experience}
          handleSelectExperience={handleSelectExperience}
          viewOnly={viewOnly}
        />
      </CardContent>
    </Card>
  );
}
