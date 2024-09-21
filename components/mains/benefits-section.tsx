import Benefits from "@/components/mains/benefits";

export default function BenefitsSection() {
  return (
    <section className="flex flex-col items-center justify-center gap-y-24">
      <h2 className="text-center text-3xl font-extrabold text-primary">
        Why choose ElysianStart?
      </h2>
      <Benefits />
    </section>
  );
}
