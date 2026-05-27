"use client";

import { ArrowRight, Check, Mail, MessageSquare, Phone } from "lucide-react";
import { useCallback, useState, useTransition } from "react";

import {
  submitRequestCar,
  type RequestCarResult,
} from "@/app/actions/request-car";
import { SectionMarker } from "@/components/site/SectionMarker";
import { cn } from "@/lib/utils";

type FieldKey =
  | "name"
  | "email"
  | "whatsapp"
  | "preferred_brand"
  | "preferred_model"
  | "cch_car_code";
type FieldErrors = Partial<Record<FieldKey, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const NOT_SURE_VALUE = "__not_sure__";

const inputClass = (hasError: boolean) =>
  cn(
    "h-11 w-full rounded-[4px] border bg-white px-3.5 text-[14px] text-corporate-black placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-cch-red/30",
    hasError
      ? "border-cch-red focus:border-cch-red"
      : "border-hairline focus:border-corporate-black",
  );

type Props = {
  brandOptions: string[];
};

export function RequestCarSection({ brandOptions }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);

      const brand = data.get("preferred_brand");
      if (brand === NOT_SURE_VALUE) {
        data.set("preferred_brand", "");
      }

      setStatus("submitting");
      setFormError(null);
      setFieldErrors({});

      startTransition(async () => {
        const result: RequestCarResult = await submitRequestCar(data);
        if (result.ok) {
          setStatus("success");
          form.reset();
          return;
        }
        setStatus("error");
        setFormError(result.error);
        const next: FieldErrors = {};
        for (const [key, value] of Object.entries(result.fieldErrors ?? {})) {
          if (key === "reference_image") continue;
          next[key as FieldKey] = value as string;
        }
        setFieldErrors(next);
      });
    },
    [],
  );

  const submitting = status === "submitting";

  return (
    <section className="border-t border-hairline bg-white">
      <div className="mx-auto w-full max-w-content px-4 py-14 sm:px-6 md:py-20 lg:px-10 lg:py-24 xl:px-16">
        <SectionMarker number="04" label="Request a car" className="mb-8 md:mb-10" />
        <div className="grid grid-cols-1 gap-10 md:gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-20">
          <div>
            <h2 className="font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[36px] md:text-[44px] lg:text-[52px]">
              Tell us what you&apos;re looking for.
            </h2>
            <p className="mt-4 max-w-[440px] text-[14px] leading-[1.65] text-text-secondary md:mt-5 md:text-[14.5px]">
              Drop the basics and a CCH operator will follow up within 24 hours
              with a shortlist from this week&apos;s lot or a sourcing plan from
              the factory desk.
            </p>

            <ul className="mt-8 flex flex-col gap-3.5 text-[13.5px] text-corporate-black md:mt-10 md:gap-4">
              <li className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-full border border-hairline text-corporate-black/70">
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                +86 198 0201 9509
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-full border border-hairline text-corporate-black/70">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                hello@chinesecarshub.com
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-full border border-hairline text-corporate-black/70">
                  <MessageSquare className="size-4" aria-hidden="true" />
                </span>
                WhatsApp · same number
              </li>
            </ul>
          </div>

          <div className="w-full rounded-[10px] border border-hairline bg-white p-5 sm:p-6 md:p-8 lg:p-10">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center md:py-14">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Check className="size-5" aria-hidden="true" />
                </span>
                <p className="font-display text-[20px] font-semibold tracking-tight text-corporate-black">
                  Request received.
                </p>
                <p className="max-w-[340px] text-[13.5px] leading-[1.55] text-text-secondary">
                  Our Guangzhou team will reach out on WhatsApp within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium uppercase tracking-[0.14em] text-corporate-black underline-offset-4 hover:underline"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4 md:gap-5"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <FormField
                    name="name"
                    label="Full name"
                    autoComplete="name"
                    required
                    error={fieldErrors.name}
                  />
                  <FormField
                    name="email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    required
                    error={fieldErrors.email}
                  />
                </div>

                <FormField
                  name="whatsapp"
                  label="WhatsApp number"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+234 …"
                  required
                  hint="Include your country code."
                  error={fieldErrors.whatsapp}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <FormSelect
                    name="preferred_brand"
                    label="Brand"
                    options={brandOptions}
                    error={fieldErrors.preferred_brand}
                  />
                  <FormField
                    name="preferred_model"
                    label="Model"
                    placeholder="e.g. Atto 3, G6"
                    error={fieldErrors.preferred_model}
                  />
                </div>

                <FormField
                  name="cch_car_code"
                  label="CCH car code (optional)"
                  placeholder="CCH-1042"
                  hint="If you saw one of our posts, paste the code here."
                  error={fieldErrors.cch_car_code}
                />

                {formError && Object.keys(fieldErrors).length === 0 ? (
                  <p
                    role="alert"
                    className="rounded-[4px] border border-cch-red/30 bg-cch-red/5 px-3 py-2 text-[12px] text-cch-red"
                  >
                    {formError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-cch-red px-8 py-[14px] text-[12.5px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-cch-red-hover sm:w-auto sm:self-start md:mt-4",
                    "disabled:cursor-not-allowed disabled:opacity-70",
                  )}
                >
                  {submitting ? "Sending…" : "Send request"}
                  {!submitting ? (
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  ) : null}
                </button>
                <p className="text-center text-[11px] leading-snug text-text-tertiary sm:text-left">
                  By submitting, you agree to be contacted by the CCH operations
                  team about your request.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type FormFieldProps = {
  name: FieldKey;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  error?: string;
};

function FormField({
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  required,
  hint,
  error,
}: FormFieldProps) {
  const id = `request-${name}`;
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-text-tertiary"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-cch-red">
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputClass(Boolean(error))}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-[11.5px] text-cch-red">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[11.5px] text-text-tertiary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type FormSelectProps = {
  name: FieldKey;
  label: string;
  options: string[];
  error?: string;
};

function FormSelect({ name, label, options, error }: FormSelectProps) {
  const id = `request-${name}`;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-text-tertiary"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          inputClass(Boolean(error)),
          "appearance-none bg-[image:linear-gradient(45deg,transparent_50%,rgb(10,10,10)_50%),linear-gradient(135deg,rgb(10,10,10)_50%,transparent_50%)] bg-[position:calc(100%-15px)_50%,calc(100%-10px)_50%] bg-[size:5px_5px,5px_5px] bg-no-repeat pr-9",
        )}
      >
        <option value="">Select a brand</option>
        <option value={NOT_SURE_VALUE}>I&apos;m not sure</option>
        {options.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} role="alert" className="text-[11.5px] text-cch-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
