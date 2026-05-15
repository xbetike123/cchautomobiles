import "server-only";

import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type TestimonialRow =
  Database["public"]["Tables"]["testimonials"]["Row"];

const FIXTURE_TESTIMONIALS: TestimonialRow[] = [
  {
    id: "f-testimonial-1",
    client_name: "Placeholder client one",
    client_title: "Managing director",
    client_company: "Placeholder import company A",
    client_city: "Lagos",
    client_country: "Nigeria",
    photo_url: null,
    quote:
      "Placeholder testimonial quote one. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    vehicle_purchased: "BYD Atto 3 (2023)",
    displayed_on_homepage: true,
    order_index: 1,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "f-testimonial-2",
    client_name: "Placeholder client two",
    client_title: "Fleet manager",
    client_company: "Placeholder import company B",
    client_city: "Accra",
    client_country: "Ghana",
    photo_url: null,
    quote:
      "Placeholder testimonial quote two. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    vehicle_purchased: "Xpeng G6 (2026)",
    displayed_on_homepage: true,
    order_index: 2,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "f-testimonial-3",
    client_name: "Placeholder client three",
    client_title: "Founder",
    client_company: "Placeholder import company C",
    client_city: "Abidjan",
    client_country: "Côte d'Ivoire",
    photo_url: null,
    quote:
      "Placeholder testimonial quote three. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    vehicle_purchased: "Zeekr 001 (2026)",
    displayed_on_homepage: true,
    order_index: 3,
    created_at: "2026-01-01T00:00:00Z",
  },
];

export async function getHomeTestimonials(): Promise<TestimonialRow[]> {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return FIXTURE_TESTIMONIALS;
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("displayed_on_homepage", true)
    .order("order_index", { ascending: true });
  if (error) {
    console.error(
      "[queries/testimonials] getHomeTestimonials failed:",
      error.message,
    );
    return FIXTURE_TESTIMONIALS;
  }
  return data ?? [];
}
