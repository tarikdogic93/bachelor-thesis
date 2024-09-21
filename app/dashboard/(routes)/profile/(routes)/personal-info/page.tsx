import { auth } from "@clerk/nextjs/server";

import { Card, CardContent } from "@/components/ui/card";
import PersonalInfoContent from "@/components/contents/personal-info-content";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-y-6 py-8 sm:px-8">
      <h1 className="text-center text-xl font-semibold tracking-wide text-muted-foreground">
        Personal info
      </h1>
      <Card className="h-fit w-fit">
        <CardContent className="px-0 py-6">
          <PersonalInfoContent />
        </CardContent>
      </Card>
    </div>
  );
}
