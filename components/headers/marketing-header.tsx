import MarketingNavbar from "@/components/navbars/marketing-navbar";
import Hero from "@/components/headers/hero";

export default function MarketingHeader() {
  return (
    <header className="flex flex-col gap-y-24 px-4 sm:px-14">
      <MarketingNavbar />
      <Hero />
    </header>
  );
}
