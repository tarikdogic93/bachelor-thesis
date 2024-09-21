import { auth } from "@clerk/nextjs/server";

import DashboardThemePicker from "@/components/themes/dashboard-theme-picker";
import DashboardModeToggle from "@/components/themes/dashboard-mode-toggle";

export default function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-y-6 p-8">
      <div className="flex flex-col gap-y-3 text-center">
        <h2 className="text-3xl font-semibold">Customize your experience</h2>
        <p className="text-lg text-muted-foreground">
          Personalize your website with a range of themes and effortlessly
          switch between light and dark modes.
        </p>
      </div>
      <div className="flex flex-col items-center gap-y-6">
        <DashboardThemePicker />
        <DashboardModeToggle />
      </div>
    </div>
  );
}
