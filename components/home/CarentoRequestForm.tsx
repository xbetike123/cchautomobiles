"use client";

import { ArrowRight, Check } from "lucide-react";
import { useCallback, useState, useTransition } from "react";

import {
  submitRequestCar,
  type RequestCarResult,
} from "@/app/actions/request-car";
import { cn } from "@/lib/utils";

type FieldKey =
  | "name"
  | "email"
  | "whatsapp"
  | "preferred_brand"
  | "preferred_model";
type FieldErrors = Partial<Record<FieldKey, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const NOT_SURE_VALUE = "__not_sure__";

type Props = {
  brandOptions: string[];
};

export function CarentoRequestForm({ brandOptions }: Props) {
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
          if (key === "reference_image" || key === "cch_car_code") continue;
          next[key as FieldKey] = value as string;
        }
        setFieldErrors(next);
      });
    },
    [],
  );

  const submitting = status === "submitting";

  return (
    <section className="bg-white pb-20 md:pb-28">
      <div className="mx-auto max-w-content px-6">
        <div className="relative overflow-hidden rounded-[24px] border border-hairline bg-surface-tint">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#f7f7f9_0%,#ffffff_55%,#fde8ea_100%)]"
          />
          <div className="grid grid-cols-1 gap-10 p-8 md:grid-cols-2 md:gap-12 md:p-14 lg:p-20">
            <div className="flex flex-col justify-center">
              <h2 className="font-display text-[34px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[44px]">
                Want to Request a Car?
              </h2>
              <p className="mt-5 max-w-[440px] text-[14px] leading-[1.65] text-text-secondary">
                Tell us what you&apos;re looking for and a CCH operator will
                follow up on WhatsApp within 24 hours with a sourcing plan from
                Guangzhou.
              </p>
            </div>

            <div className="rounded-[18px] border border-hairline bg-white p-6 shadow-card md:p-8">
              <h3 className="font-display text-[22px] font-semibold text-corporate-black">
                Request a Car
              </h3>
              <p className="mt-2 text-[13px] text-text-secondary">
                Share the basics — name, contact, and what you&apos;re after.
              </p>

              {status === "success" ? (
                <div className="mt-6 flex flex-col items-center gap-3 rounded-[12px] bg-surface-tint p-8 text-center">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check className="size-5" aria-hidden="true" />
                  </span>
                  <p className="font-display text-[18px] font-semibold text-corporate-black">
                    Request received.
                  </p>
                  <p className="max-w-[300px] text-[13px] text-text-secondary">
                    Our Guangzhou team will reach out on WhatsApp within 24
                    hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-cch-red hover:text-cch-red-hover"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-6 flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      name="name"
                      label="Full name"
                      autoComplete="name"
                      required
                      error={fieldErrors.name}
                    />
                    <Input
                      name="email"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      required
                      error={fieldErrors.email}
                    />
                  </div>
                  <Input
                    name="whatsapp"
                    label="WhatsApp"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+234 …"
                    required
                    error={fieldErrors.whatsapp}
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Select
                      name="preferred_brand"
                      label="Brand"
                      options={brandOptions}
                      error={fieldErrors.preferred_brand}
                    />
                    <Input
                      name="preferred_model"
                      label="Model"
                      placeholder="e.g. Atto 3"
                      error={fieldErrors.preferred_model}
                    />
                  </div>

                  {formError && Object.keys(fieldErrors).length === 0 ? (
                    <p
                      role="alert"
                      className="rounded-[8px] border border-cch-red/30 bg-cch-red/5 px-3 py-2 text-[12px] text-cch-red"
                    >
                      {formError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={cn(
                      "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cch-red px-7 py-3.5 text-[13.5px] font-semibold text-white hover:bg-cch-red-hover",
                      "disabled:cursor-not-allowed disabled:opacity-70",
                    )}
                  >
                    {submitting ? "Sending…" : "Send Request"}
                    {!submitting ? (
                      <ArrowRight className="size-4" aria-hidden="true" />
                    ) : null}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type InputProps = {
  name: FieldKey;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
};

function Input(props: InputProps) {
  const id = `carento-${props.name}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11.5px] font-medium text-text-tertiary"
      >
        {props.label}
        {props.required ? (
          <span aria-hidden="true" className="ml-1 text-cch-red">
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={props.name}
        type={props.type ?? "text"}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        className={cn(
          "h-11 rounded-[10px] border bg-white px-3.5 text-[14px] text-corporate-black placeholder:text-text-tertiary focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/20",
          props.error ? "border-cch-red" : "border-hairline",
        )}
      />
      {props.error ? (
        <p className="text-[11.5px] text-cch-red">{props.error}</p>
      ) : null}
    </div>
  );
}

type SelectProps = {
  name: FieldKey;
  label: string;
  options: string[];
  error?: string;
};

function Select(props: SelectProps) {
  const id = `carento-${props.name}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11.5px] font-medium text-text-tertiary"
      >
        {props.label}
      </label>
      <select
        id={id}
        name={props.name}
        defaultValue=""
        aria-invalid={props.error ? true : undefined}
        className={cn(
          "h-11 appearance-none rounded-[10px] border bg-white px-3.5 pr-9 text-[14px] text-corporate-black focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/20",
          "bg-[image:linear-gradient(45deg,transparent_50%,rgb(10,10,10)_50%),linear-gradient(135deg,rgb(10,10,10)_50%,transparent_50%)] bg-[position:calc(100%-15px)_50%,calc(100%-10px)_50%] bg-[size:5px_5px,5px_5px] bg-no-repeat",
          props.error ? "border-cch-red" : "border-hairline",
        )}
      >
        <option value="">Select a brand</option>
        <option value={NOT_SURE_VALUE}>I&apos;m not sure</option>
        {props.options.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      {props.error ? (
        <p className="text-[11.5px] text-cch-red">{props.error}</p>
      ) : null}
    </div>
  );
}
