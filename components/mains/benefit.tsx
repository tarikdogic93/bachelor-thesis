import { BenefitType } from "@/data/benefits-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type BenefitProps = {
  benefit: BenefitType;
};

export default function Benefit({
  benefit: { icon: Icon, title, description },
}: BenefitProps) {
  return (
    <Card className="relative h-full w-full border border-from bg-muted">
      <CardHeader className="space-y-8">
        <Icon className="mx-auto h-16 w-16 rounded-full bg-primary p-3 text-secondary" />
        <h3 className="text-center text-xl font-bold text-primary">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-center text-sm font-normal text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
