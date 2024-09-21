import { Progress } from "@/components/ui/progress";

type SkillProgressProps = {
  rating: number;
};

export default function SkillProgress({ rating }: SkillProgressProps) {
  return (
    <Progress
      className="h-3 bg-primary/20"
      indicatorClassName="bg-from"
      value={(rating / 10) * 100}
    />
  );
}
