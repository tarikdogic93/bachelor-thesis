import Testimonials from "@/components/mains/testimonials";

export default function TestimonialsSection() {
  return (
    <section className="flex flex-col items-center justify-center gap-y-24">
      <div className="flex flex-col items-center justify-center gap-y-6">
        <h2 className="text-center text-3xl font-extrabold text-primary">
          Don&apos;t take our word for it
        </h2>
        <p className="w-full text-center text-lg font-normal text-muted-foreground lg:w-3/4 xl:w-2/3">
          See what our users have to say about ElysianStart. Their experiences
          speak volumes about the opportunities and connections our platform
          provides. Discover real success stories that could be your own.
        </p>
      </div>
      <Testimonials />
    </section>
  );
}
