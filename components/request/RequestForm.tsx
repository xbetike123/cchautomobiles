"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import {
  BUDGET_RANGES,
  CONDITIONS,
  TIMELINES,
  VEHICLE_TYPES,
  quoteRequestSchema,
  type QuoteRequestInput,
} from "@/app/request/schema";
import { Confirmation } from "@/components/request/Confirmation";
import { DESTINATION_COUNTRIES } from "@/components/request/countries";
import {
  COUNTRY_CODES,
  CountryCodeSelect,
} from "@/components/request/CountryCodeSelect";
import { cn } from "@/lib/utils";

type AboutCar = {
  slug: string;
  label: string;
  year: number;
  brand: string;
  model: string;
  condition: "new" | "used";
  bodyType: string | null;
  priceUsdFob: number;
  heroImageUrl: string;
};

const PREFERRED_BRANDS = [
  "BYD",
  "Changan",
  "XPENG",
  "Geely",
  "Zeekr",
  "NIO",
  "Li Auto",
  "AITO",
  "Hongqi",
  "Jetour",
  "Xiaomi",
  "Deepal",
  "GAC",
  "Other",
] as const;

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type Props = {
  submit: (
    input: QuoteRequestInput,
  ) => Promise<
    | { ok: true }
    | { ok: false; error: string; fieldErrors?: Record<string, string> }
  >;
  whatsappContact: string | null;
  aboutCar?: AboutCar | null;
  headerLabel: string;
  headerTitle: string;
  headerBody: string;
};

const baseDefaults: QuoteRequestInput = {
  vehicleType: undefined,
  conditionPreference: "either",
  budgetRange: undefined,
  timeline: undefined,
  name: "",
  whatsappDialCode: COUNTRY_CODES[0].dial,
  whatsappLocalNumber: "",
  email: "",
  destinationCity: "",
  destinationCountry: "",
  preferredBrand: "",
  notes: "",
  aboutCarSlug: "",
};

export function RequestForm({
  submit,
  whatsappContact,
  aboutCar,
  headerLabel,
  headerTitle,
  headerBody,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<QuoteRequestInput>({
    resolver: zodResolver(quoteRequestSchema) as Resolver<QuoteRequestInput>,
    defaultValues: {
      ...baseDefaults,
      aboutCarSlug: aboutCar?.slug ?? "",
    },
    mode: "onBlur",
  });
  const [submittedValues, setSubmittedValues] =
    useState<QuoteRequestInput | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const result = await submit(values);
        if (result.ok) {
          setSubmittedValues(values);
          return;
        }
        if (result.fieldErrors) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            setError(field as keyof QuoteRequestInput, { message });
          }
        }
        setServerError(result.error);
      } catch (error) {
        console.error("[request] submit failed", error);
        setServerError(
          "Something went wrong submitting your request. Please try again, or reach us on WhatsApp.",
        );
      }
    });
  });

  if (submittedValues) {
    return (
      <Confirmation
        whatsappNumber={whatsappContact}
        name={submittedValues.name}
        notes={submittedValues.notes ?? null}
        destinationCity={submittedValues.destinationCity ?? null}
        destinationCountry={submittedValues.destinationCountry}
        aboutCarLabel={aboutCar?.label ?? null}
      />
    );
  }

  return (
    <>
      <div className="mb-12 text-center">
        <div className="mx-auto h-6 w-[2px] bg-cch-red" aria-hidden />
        <p className="mt-4 text-meta text-cch-red">{headerLabel}</p>
        <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-corporate-black md:text-[44px]">
          {headerTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-[460px] text-[15px] leading-relaxed text-text-secondary">
          {headerBody}
        </p>
      </div>
      <form onSubmit={onSubmit} noValidate className="space-y-10">
        <input type="hidden" {...register("aboutCarSlug")} />
        {aboutCar && <AboutCarPreview car={aboutCar} />}

      <Section label="Your details">
        <div className="space-y-3">
          <TextField
            label="Full name *"
            error={errors.name?.message}
            registerProps={register("name")}
            autoComplete="name"
          />
          <div className="grid grid-cols-[140px_1fr] gap-3">
            <Controller
              control={control}
              name="whatsappDialCode"
              render={({ field }) => (
                <CountryCodeSelect value={field.value} onChange={field.onChange} />
              )}
            />
            <TextField
              label="WhatsApp number *"
              error={errors.whatsappLocalNumber?.message}
              registerProps={register("whatsappLocalNumber")}
              inputMode="tel"
              autoComplete="tel-national"
            />
          </div>
          <TextField
            label="Email *"
            type="email"
            error={errors.email?.message}
            registerProps={register("email")}
            autoComplete="email"
          />
          <SelectField
            label="Destination country *"
            placeholder="Select a country"
            error={errors.destinationCountry?.message}
            registerProps={register("destinationCountry")}
            options={DESTINATION_COUNTRIES.map((c) => ({
              value: c,
              label: c,
            }))}
          />
          <TextField
            label="Destination city / port"
            error={errors.destinationCity?.message}
            registerProps={register("destinationCity")}
            autoComplete="address-level2"
          />
        </div>
      </Section>

      {!aboutCar && (
        <Section label="Preferred brand (optional)">
          <SelectField
            label="Preferred brand"
            placeholder="I'm not sure yet"
            error={errors.preferredBrand?.message}
            registerProps={register("preferredBrand")}
            options={PREFERRED_BRANDS.map((b) => ({ value: b, label: b }))}
          />
        </Section>
      )}

      {!aboutCar && (
        <Section label="What you're looking for">
          <div className="space-y-3">
            <SelectField
              label="Vehicle type"
              placeholder="Select a type"
              error={errors.vehicleType?.message}
              registerProps={register("vehicleType")}
              options={VEHICLE_TYPES.map((v) => ({
                value: v.value,
                label: v.label,
              }))}
            />
            <SelectField
              label="Condition"
              placeholder="Select a condition"
              error={errors.conditionPreference?.message}
              registerProps={register("conditionPreference")}
              options={CONDITIONS.map((c) => ({
                value: c.value,
                label: c.label,
              }))}
            />
            <SelectField
              label="Budget"
              placeholder="Select a budget"
              error={errors.budgetRange?.message}
              registerProps={register("budgetRange")}
              options={BUDGET_RANGES.map((b) => ({
                value: b.value,
                label: b.label,
              }))}
            />
            <SelectField
              label="Timeline"
              placeholder="Select a timeline"
              error={errors.timeline?.message}
              registerProps={register("timeline")}
              options={TIMELINES.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
            />
          </div>
        </Section>
      )}

      <Section label="Anything else? (optional)">
        <textarea
          {...register("notes")}
          rows={4}
          placeholder={
            aboutCar
              ? "Delivery port, paperwork notes, must-have specs…"
              : "Anything else we should know — specific models, must-have specs, delivery port…"
          }
          className={cn(
            "w-full rounded-md border bg-white px-4 py-3 text-[14px] leading-relaxed text-corporate-black placeholder:text-text-tertiary focus:outline-none",
            errors.notes
              ? "border-cch-red focus:border-cch-red"
              : "border-hairline focus:border-corporate-black",
          )}
        />
        {errors.notes?.message && (
          <p className="mt-2 text-[12px] text-cch-red">{errors.notes.message}</p>
        )}
      </Section>

      {serverError && (
        <div className="rounded-md border border-cch-red px-4 py-3 text-[13px] text-cch-red">
          {serverError}
        </div>
      )}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-button bg-cch-red px-7 py-[16px] text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.28)] transition-all hover:bg-cch-red-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : "Submit Request"}
        </button>
        <p className="text-center text-[12px] text-text-tertiary">
          Your information stays secure with CCH Automobile. We never share your
          details with third parties.
        </p>
      </div>
      </form>
    </>
  );
}

function AboutCarPreview({ car }: { car: AboutCar }) {
  const isNew = car.condition === "new";
  return (
    <div className="overflow-hidden rounded-card-lg border border-cch-red/40 bg-white shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 border-b border-cch-red/20 bg-cch-red-soft px-5 py-2.5">
        <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-cch-red">
          Asking about
        </span>
      </div>
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-surface-warm sm:w-44 sm:shrink-0">
          <Image
            src={car.heroImageUrl}
            alt={car.label}
            fill
            sizes="(min-width: 640px) 176px, 100vw"
            className="object-cover"
          />
          <span className="absolute left-3 top-3 inline-flex items-center rounded-chip bg-cch-red px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-white">
            {isNew ? "New" : "Used"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[20px] font-semibold leading-tight text-corporate-black">
            {car.brand} {car.model}
          </h2>
          <p className="mt-1 text-[12.5px] text-text-tertiary">
            {car.year}
            {car.bodyType ? ` · ${car.bodyType}` : ""}
            {" · "}Guangzhou
          </p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-display text-[20px] font-semibold leading-none text-cch-red">
              {usdFormatter.format(car.priceUsdFob)}
            </span>
            <span className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              FOB
            </span>
          </div>
          <Link
            href={`/lot/${car.slug}`}
            className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-corporate-black underline decoration-cch-red/40 decoration-2 underline-offset-4 hover:decoration-cch-red"
          >
            View full details
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <div className="mb-3 text-meta text-corporate-black">{label}</div>
      {children}
      {error && <p className="mt-2 text-[12px] text-cch-red">{error}</p>}
    </div>
  );
}

function TextField({
  label,
  error,
  registerProps,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;
  error?: string;
  registerProps: ReturnType<ReturnType<typeof useForm>["register"]>;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <div className="relative">
        <input
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder=" "
          {...registerProps}
          className={cn(
            "peer h-[58px] w-full rounded-md border bg-white px-4 pb-2 pt-6 text-[14px] text-corporate-black focus:outline-none",
            "placeholder:text-transparent",
            error
              ? "border-cch-red focus:border-cch-red"
              : "border-hairline focus:border-corporate-black",
          )}
        />
        <span
          className={cn(
            "pointer-events-none absolute left-4 top-2.5 text-[10.5px] font-medium uppercase tracking-[0.1em] transition-all",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[14px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-text-tertiary",
            "peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[10.5px] peer-focus:font-medium peer-focus:uppercase peer-focus:tracking-[0.1em]",
            error
              ? "text-cch-red peer-focus:text-cch-red peer-placeholder-shown:text-cch-red"
              : "text-text-tertiary peer-focus:text-corporate-black",
          )}
        >
          {label}
        </span>
      </div>
      {error && <p className="mt-1 text-[12px] text-cch-red">{error}</p>}
    </label>
  );
}

function SelectField({
  label,
  placeholder,
  error,
  registerProps,
  options,
}: {
  label: string;
  placeholder: string;
  error?: string;
  registerProps: ReturnType<ReturnType<typeof useForm>["register"]>;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <div className="relative">
        <select
          {...registerProps}
          className={cn(
            "h-[58px] w-full appearance-none rounded-md border bg-white px-4 pb-2 pt-6 text-[14px] text-corporate-black focus:outline-none",
            error
              ? "border-cch-red focus:border-cch-red"
              : "border-hairline focus:border-corporate-black",
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          className={cn(
            "pointer-events-none absolute left-4 top-2.5 text-[10.5px] font-medium uppercase tracking-[0.1em] transition-all",
            error ? "text-cch-red" : "text-text-tertiary",
          )}
        >
          {label}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary"
        />
      </div>
      {error && <p className="mt-1 text-[12px] text-cch-red">{error}</p>}
    </label>
  );
}
