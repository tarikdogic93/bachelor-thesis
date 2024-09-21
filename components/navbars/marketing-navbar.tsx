import Image from "next/image";

import AuthButton from "@/components/buttons/auth-button";
import MarketingModeToggle from "@/components/themes/marketing-mode-toggle";
import MarketingThemePicker from "@/components/themes/marketing-theme-picker";

export default function MarketingNavbar() {
  return (
    <nav className="flex w-full items-center justify-center py-8 md:justify-between">
      <div className="hidden items-center gap-x-6 md:flex">
        <Image src="/icons/logo.svg" alt="Logo" width={40} height={40} />
        <p className="text-3xl font-semibold text-primary">ElysianStart</p>
      </div>
      <div className="flex items-center gap-x-2 sm:flex-1 sm:justify-between md:flex-none">
        <AuthButton />
        <div className="flex items-center gap-x-2">
          <MarketingModeToggle />
          <MarketingThemePicker />
        </div>
      </div>
    </nav>
  );
}
