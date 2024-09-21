import BenefitsSection from "@/components/mains/benefits-section";
import TestimonialsSection from "@/components/mains/testimonials-section";

export default function MarketingMain() {
  return (
    <main className="mt-44 flex flex-col gap-y-32 px-4 max-sm:mb-12 sm:px-14">
      <BenefitsSection />
      <TestimonialsSection />
    </main>
  );
}
