import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import { Card, CardContent } from "@/components/ui/card";
import AchievementContent from "@/components/contents/achievement-content";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (user?.publicMetadata.role !== "Applicant") {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center gap-y-6 py-8 sm:px-8">
      <h1 className="text-center text-xl font-semibold tracking-wide text-muted-foreground">
        Achievements
      </h1>
      <Card>
        <CardContent className="px-0 py-6">
          <AchievementContent />
        </CardContent>
      </Card>
    </div>
  );
}
