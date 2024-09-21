import { Doc } from "@/convex/_generated/dataModel";

type SkillDetailsProps = {
  skill: Doc<"skills">;
};

export default function SkillDetails({ skill }: SkillDetailsProps) {
  return (
    <div className="grid grid-cols-4 gap-3 rounded-md border p-6">
      <h3 className="col-span-full truncate font-medium">{skill.name}</h3>
      {skill.description && (
        <p className="col-span-full text-sm text-muted-foreground">
          {skill.description}
        </p>
      )}
    </div>
  );
}
