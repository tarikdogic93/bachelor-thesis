import { useMediaQuery } from "usehooks-ts";
import { Doc } from "@/convex/_generated/dataModel";

import { Card, CardContent } from "@/components/ui/card";

import SkillOptions from "@/components/contents/skill-options";
import SkillBadge from "@/components/contents/skill-badge";
import SkillProgress from "@/components/contents/skill-progress";

type SkillProps = {
  skill: Doc<"skills">;
  handleSelectSkill?: (skill: Doc<"skills">) => void;
  viewOnly?: boolean;
};

export default function Skill({
  skill,
  handleSelectSkill,
  viewOnly,
}: SkillProps) {
  const matchesSmMediaQuery = useMediaQuery("(min-width: 640px)");

  return (
    <Card className="w-full bg-muted/20">
      <CardContent className="flex flex-col items-center gap-y-3 p-4 sm:items-start sm:gap-y-4">
        {matchesSmMediaQuery ? (
          <>
            <div className="flex w-full items-center justify-between">
              <SkillBadge name={skill.name} rating={skill.rating} />
              <SkillOptions
                skill={skill}
                handleSelectSkill={handleSelectSkill}
                viewOnly={viewOnly}
              />
            </div>
            <SkillProgress rating={skill.rating} />
          </>
        ) : (
          <>
            <SkillBadge name={skill.name} rating={skill.rating} />
            <SkillProgress rating={skill.rating} />
            <SkillOptions
              skill={skill}
              handleSelectSkill={handleSelectSkill}
              viewOnly={viewOnly}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
