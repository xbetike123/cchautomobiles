import { SectionHeader } from "@/components/site/SectionHeader";
import { getHomeTestimonials } from "@/lib/queries/testimonials";
import { TestimonialsCarousel } from "./TestimonialsCarousel";

export async function Testimonials() {
  const testimonials = await getHomeTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-content px-6 py-12 md:py-24">
        <SectionHeader
          label="Clients"
          heading="From importers across West Africa."
        />
        <div className="mt-12">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
