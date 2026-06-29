"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import {
  BUYER_TYPES,
  CONSULTATION_TOPICS,
  consultationRequestSchema,
  type ConsultationRequestInput,
} from "@/app/consultation/schema";
import { ChipMultiSelect } from "@/components/request/ChipMultiSelect";
import {
  COUNTRY_CODES,
  CountryCodeSelect,
} from "@/components/request/CountryCodeSelect";
import { DESTINATION_COUNTRIES } from "@/components/request/countries";
import { cn } from "@/lib/utils";

type Props = {
  submit: (
    input: ConsultationRequestInput,
  ) => Promise<
    | { ok: true }
    | { ok: false; error: string; fieldErrors?: Record<string, string> }
  >;
  whatsappContact: string | null;
};

const baseDefaults: ConsultationRequestInput = {
  name: "",
  whatsappDialCode: COUNTRY_CODES[0].dial,
  whatsappLocalNumber: "",
  email: "",
  country: "",
  buyerType: undefined,
  topics: [],
};

export function ConsultationForm({ submit, whatsappContact }: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ConsultationRequestInput>({
    resolver: zodResolver(
      consultationRequestSchema,
    ) as Resolver<ConsultationRequestInput>,
    defaultValues: baseDefaults,
    mode: "onBlur",
  });
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submit(values);
      if (result.ok) {
        setSubmittedName(values.name);
        return;
      }
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ConsultationRequestInput, { message });
        }
      }
      setServerError(result.error);
    });
  });

  if (submittedName) {
    const waLink = whatsappContact
      ? `https://wa.me/${whatsappContact.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
          `Hi CCH, this is ${submittedName}. I just booked a consultation on your site.`,
        )}`
      : null;
    return (
      <div className="rounded-card-lg border border-hairline bg-white p-8 text-center shadow-[var(--shadow-card)]">
        <span
          className="mx-auto grid size-12 place-items-center rounded-full bg-cch-red-soft"
          aria-hidden
        >
          <Check className="size-6 text-cch-red" />
        </span>
        <h3 className="mt-5 font-display text-[24px] font-semibold leading-tight text-corporate-black">
          You&rsquo;re booked in, {submittedName.split(" ")[0]}.
        </h3>
        <p className="mx-auto mt-3 max-w-[420px] text-[14.5px] leading-relaxed text-text-secondary">
          We&rsquo;ve emailed your confirmation. Our Guangzhou team will reach
          out shortly to confirm a time and share the next steps.
        </p>
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-button bg-cch-red px-7 py-[14px] text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.28)] transition-all hover:bg-cch-red-hover"
          >
            Message us on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
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
            label="Country *"
            placeholder="Select a country"
            error={errors.country?.message}
            registerProps={register("country")}
            options={DESTINATION_COUNTRIES.map((c) => ({ value: c, label: c }))}
          />
        </div>
      </Section>

      <Section label="What would you like help with? (optional)">
        <Controller
          control={control}
          name="topics"
          render={({ field }) => (
            <ChipMultiSelect
              name="topics"
              ariaLabel="Consultation topics"
              options={CONSULTATION_TOPICS.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </Section>

      <Section label="About you (optional)">
        <div className="space-y-3">
          <SelectField
            label="Which best describes you?"
            placeholder="Select an option"
            error={errors.buyerType?.message}
            registerProps={register("buyerType")}
            options={BUYER_TYPES.map((b) => ({ value: b.value, label: b.label }))}
          />
        </div>
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
          {pending ? "Sending…" : "Book My Consultation"}
        </button>
        <p className="text-center text-[12px] text-text-tertiary">
          Your information stays with CCH. We never share leads with third
          parties.
        </p>
      </div>
    </form>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 text-meta text-corporate-black">{label}</div>
      {children}
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
