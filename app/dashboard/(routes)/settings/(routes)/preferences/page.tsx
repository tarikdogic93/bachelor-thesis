import { auth } from "@clerk/nextjs/server";

import PreferencesContent from "@/components/contents/preferences-content";

export default function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-y-6 p-8">
      <div className="flex flex-col gap-y-3 text-center">
        <h2 className="text-3xl font-semibold">Control of your preferences</h2>
        <p className="text-lg text-muted-foreground">
          Customize notification settings and personalize other options to align
          perfectly with your needs.
        </p>
      </div>
      <PreferencesContent />
    </div>
  );
}
