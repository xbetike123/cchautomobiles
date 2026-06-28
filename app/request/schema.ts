import { z } from "zod";

export const VEHICLE_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "mpv", label: "MPV" },
  { value: "pickup", label: "Pickup" },
  { value: "van", label: "Van" },
  { value: "truck", label: "Truck" },
  { value: "not_sure", label: "Not sure" },
] as const;

export const CONDITIONS = [
  { value: "new", label: "Brand New" },
  { value: "used", label: "Clean Used" },
  { value: "either", label: "Either" },
] as const;

export const BUDGET_RANGES = [
  { value: "under_10k", label: "Under $10,000", min: 0, max: 10_000 },
  { value: "10k_20k", label: "$10,000 – $20,000", min: 10_000, max: 20_000 },
  { value: "20k_30k", label: "$20,000 – $30,000", min: 20_000, max: 30_000 },
  { value: "30k_50k", label: "$30,000 – $50,000", min: 30_000, max: 50_000 },
  { value: "over_50k", label: "$50,000+", min: 50_000, max: 0 },
  { value: "not_sure", label: "Not sure yet", min: 0, max: 0 },
] as const;

export const TIMELINES = [
  { value: "immediately", label: "Immediately" },
  { value: "within_30_days", label: "Within 30 days" },
  { value: "1_3_months", label: "1–3 months" },
  { value: "3_6_months", label: "3–6 months" },
  { value: "researching", label: "Just researching" },
] as const;

const vehicleTypeValues = VEHICLE_TYPES.map((v) => v.value) as [
  string,
  ...string[],
];
const conditionValues = CONDITIONS.map((c) => c.value) as [string, ...string[]];
const budgetValues = BUDGET_RANGES.map((b) => b.value) as [string, ...string[]];
const timelineValues = TIMELINES.map((t) => t.value) as [string, ...string[]];

const optionalText = (max: number) =>
  z.preprocess(
    (v) => {
      if (typeof v !== "string") return undefined;
      const t = v.trim();
      return t.length === 0 ? undefined : t;
    },
    z.string().max(max).optional(),
  );

const optionalEnum = (values: [string, ...string[]]) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.length > 0 ? v : undefined),
    z.enum(values).optional(),
  );

export const quoteRequestSchema = z.object({
  // Structured intent questions (all optional — each dropdown has an "unsure"
  // escape hatch so leads are never blocked).
  vehicleType: optionalEnum(vehicleTypeValues),
  conditionPreference: z.enum(conditionValues).default("either"),
  budgetRange: optionalEnum(budgetValues),
  timeline: optionalEnum(timelineValues),
  // Contact + destination (required) and free-text extras.
  name: z.string().trim().min(1, "Name is required").max(120),
  whatsappDialCode: z.string().regex(/^\+\d{1,4}$/, "Pick a country code"),
  whatsappLocalNumber: z
    .string()
    .trim()
    .min(5, "Enter your WhatsApp number")
    .max(20)
    .regex(/^[\d\s()-]+$/, "Digits, spaces, () and - only"),
  email: z.email("Enter a valid email").max(254),
  destinationCountry: z
    .string()
    .trim()
    .min(1, "Where is it going?")
    .max(120),
  destinationCity: optionalText(120),
  preferredBrand: optionalText(120),
  notes: optionalText(2000),
  aboutCarSlug: optionalText(120),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
