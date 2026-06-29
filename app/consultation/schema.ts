import { z } from "zod";

export const BUYER_TYPES = [
  { value: "first_time", label: "First-time buyer" },
  { value: "dealership", label: "Car dealership" },
  { value: "fleet_operator", label: "Fleet operator" },
  { value: "business_import", label: "Business importing multiple vehicles" },
  { value: "comparing", label: "Comparing several models" },
  { value: "other", label: "Other" },
] as const;

export const CONSULTATION_TOPICS = [
  { value: "vehicle_choice", label: "Choosing the right vehicle" },
  { value: "real_cost", label: "Understanding the real cost" },
  { value: "import_process", label: "Import & export process" },
  { value: "ev_charging", label: "EV charging & maintenance" },
  { value: "fleet", label: "Fleet & business projects" },
] as const;

const buyerTypeValues = BUYER_TYPES.map((b) => b.value) as [string, ...string[]];
const topicValues = CONSULTATION_TOPICS.map((t) => t.value) as [
  string,
  ...string[],
];

const optionalEnum = (values: [string, ...string[]]) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.length > 0 ? v : undefined),
    z.enum(values).optional(),
  );

export const consultationRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  whatsappDialCode: z.string().regex(/^\+\d{1,4}$/, "Pick a country code"),
  whatsappLocalNumber: z
    .string()
    .trim()
    .min(5, "Enter your WhatsApp number")
    .max(20)
    .regex(/^[\d\s()-]+$/, "Digits, spaces, () and - only"),
  email: z.email("Enter a valid email").max(254),
  country: z.string().trim().min(1, "Select your country").max(120),
  buyerType: optionalEnum(buyerTypeValues),
  topics: z.array(z.enum(topicValues)).default([]),
});

export type ConsultationRequestInput = z.infer<typeof consultationRequestSchema>;
