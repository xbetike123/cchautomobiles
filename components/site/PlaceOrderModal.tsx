"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Phone, Receipt, Sparkles, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";

import { submitPlaceOrder, type PlaceOrderResult } from "@/app/actions/place-order";
import { cn } from "@/lib/utils";

type Prefill = {
  carCode?: string | null;
  carName?: string | null;
  brand?: string | null;
  model?: string | null;
};

type ModalContextValue = {
  open: (prefill?: Prefill) => void;
};

const PlaceOrderModalContext = createContext<ModalContextValue | null>(null);

export function usePlaceOrderModal() {
  const ctx = useContext(PlaceOrderModalContext);
  if (!ctx) {
    throw new Error(
      "usePlaceOrderModal must be used inside <PlaceOrderModalProvider>",
    );
  }
  return ctx;
}

type FieldKey =
  | "name"
  | "phone"
  | "whatsapp"
  | "email"
  | "car_code"
  | "preferred_brand"
  | "preferred_model"
  | "condition"
  | "budget_min"
  | "budget_max"
  | "timeline"
  | "destination_port"
  | "notes";

type FieldErrors = Partial<Record<FieldKey, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const DESTINATION_PORTS = [
  "Lagos Apapa (Nigeria)",
  "Lagos Tin Can (Nigeria)",
  "Tema (Ghana)",
  "Cotonou (Benin)",
  "Dakar (Senegal)",
  "Other",
];

const TIMELINE_OPTIONS: { value: string; label: string }[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "this_week", label: "This week" },
  { value: "this_month", label: "This month" },
  { value: "flexible", label: "Flexible" },
];

type Props = {
  children: ReactNode;
  brandOptions: string[];
};

export function PlaceOrderModalProvider({ children, brandOptions }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const reset = useCallback(() => {
    setStatus("idle");
    setFormError(null);
    setFieldErrors({});
    setPrefill(null);
    setOrderId(null);
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setIsOpen(next);
      if (!next) setTimeout(reset, 200);
    },
    [reset],
  );

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setFormError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result: PlaceOrderResult = await submitPlaceOrder(data);
      if (result.ok) {
        setStatus("success");
        setOrderId(result.orderId);
        form.reset();
        return;
      }
      setStatus("error");
      setFormError(result.error);
      setFieldErrors(result.fieldErrors ?? {});
    });
  }, []);

  const value = useMemo<ModalContextValue>(
    () => ({
      open: (next) => {
        reset();
        setPrefill(next ?? null);
        setIsOpen(true);
      },
    }),
    [reset],
  );

  const submitting = status === "submitting";

  return (
    <PlaceOrderModalContext.Provider value={value}>
      {children}
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-corporate-black/40 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity duration-200" />
          <Dialog.Popup
            className={cn(
              "fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto",
              "rounded-2xl bg-background p-7 shadow-[0_24px_60px_rgba(10,10,10,0.18)]",
              "transition-all duration-200",
              "data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98]",
              "data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.98]",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-meta text-cch-red">Place an order</p>
                <Dialog.Title className="mt-2 font-display text-2xl font-semibold leading-tight text-corporate-black">
                  Lock in your order today.
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm leading-[1.55] text-text-secondary">
                  Drop your details and a CCH operator will call you within
                  15 minutes to confirm. The invoice lands in your inbox right
                  after the call.
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="Close"
                className="-mr-2 -mt-2 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-corporate-black/60 hover:bg-surface-tint hover:text-corporate-black"
              >
                <X className="size-4" aria-hidden="true" />
              </Dialog.Close>
            </div>

            {status === "success" ? (
              <SuccessPanel
                orderId={orderId}
                onClose={() => handleOpenChange(false)}
              />
            ) : (
              <>
                <FlowSteps />

                <form
                  onSubmit={handleSubmit}
                  className="mt-5 flex flex-col gap-4"
                  noValidate
                >
                  {prefill?.carCode || prefill?.carName ? (
                    <div className="rounded-lg border border-cch-red/30 bg-cch-red-soft/60 px-3 py-2.5">
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-cch-red">
                        Ordering
                      </p>
                      <p className="mt-0.5 text-[13.5px] font-medium text-cch-red">
                        {prefill.carName ?? "—"}
                        {prefill.carCode ? ` · ${prefill.carCode}` : ""}
                      </p>
                    </div>
                  ) : null}

                  <SectionLabel>Contact</SectionLabel>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                      name="name"
                      label="Full name"
                      autoComplete="name"
                      required
                      error={fieldErrors.name}
                    />
                    <TextField
                      name="email"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      required
                      error={fieldErrors.email}
                    />
                    <TextField
                      name="phone"
                      label="Phone (we call this)"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+234 …"
                      required
                      hint="Include your country code."
                      error={fieldErrors.phone}
                    />
                    <TextField
                      name="whatsapp"
                      label="WhatsApp (optional)"
                      type="tel"
                      placeholder="+234 …"
                      hint="If different from your phone."
                      error={fieldErrors.whatsapp}
                    />
                  </div>

                  <SectionLabel>The order</SectionLabel>
                  <TextField
                    name="car_code"
                    label="Specific car code (optional)"
                    placeholder="e.g. CCH-1042"
                    hint="Skip if you don't have one in mind yet."
                    defaultValue={prefill?.carCode ?? ""}
                    error={fieldErrors.car_code}
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SelectField
                      name="preferred_brand"
                      label="Preferred brand"
                      options={brandOptions}
                      defaultValue={prefill?.brand ?? ""}
                      error={fieldErrors.preferred_brand}
                    />
                    <TextField
                      name="preferred_model"
                      label="Preferred model"
                      placeholder="e.g. Atto 3, G6"
                      defaultValue={prefill?.model ?? ""}
                      error={fieldErrors.preferred_model}
                    />
                  </div>

                  <SelectField
                    name="condition"
                    label="Condition"
                    options={["new", "used", "either"]}
                    optionLabels={{
                      new: "New from factory",
                      used: "First-owner used",
                      either: "Either",
                    }}
                    defaultValue="either"
                    placeholder=""
                    error={fieldErrors.condition}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                      name="budget_min"
                      label="Budget min (USD)"
                      type="number"
                      inputMode="decimal"
                      placeholder="e.g. 12000"
                      error={fieldErrors.budget_min}
                    />
                    <TextField
                      name="budget_max"
                      label="Budget max (USD)"
                      type="number"
                      inputMode="decimal"
                      placeholder="e.g. 22000"
                      error={fieldErrors.budget_max}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SelectField
                      name="timeline"
                      label="Timeline"
                      options={TIMELINE_OPTIONS.map((opt) => opt.value)}
                      optionLabels={Object.fromEntries(
                        TIMELINE_OPTIONS.map((opt) => [opt.value, opt.label]),
                      )}
                      defaultValue="this_month"
                      placeholder=""
                      error={fieldErrors.timeline}
                    />
                    <SelectField
                      name="destination_port"
                      label="Destination port"
                      options={DESTINATION_PORTS}
                      placeholder="Pick a port"
                      error={fieldErrors.destination_port}
                    />
                  </div>

                  <TextAreaField
                    name="notes"
                    label="Anything else?"
                    placeholder="Color preferences, must-have specs, delivery notes…"
                    error={fieldErrors.notes}
                  />

                  {formError && Object.keys(fieldErrors).length === 0 ? (
                    <p
                      role="alert"
                      className="rounded-lg border border-cch-red/30 bg-cch-red/5 px-3 py-2 text-xs text-cch-red"
                    >
                      {formError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={cn(
                      "mt-1 inline-flex items-center justify-center rounded-button bg-cch-red px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.28)] transition-colors hover:bg-cch-red-hover",
                      "disabled:cursor-not-allowed disabled:opacity-70",
                    )}
                  >
                    {submitting ? "Placing order…" : "Place my order"}
                  </button>
                  <p className="text-center text-[11px] leading-snug text-text-secondary">
                    By placing this order you agree to be called and emailed
                    by the CCH operations team. No card is charged from this
                    form.
                  </p>
                </form>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </PlaceOrderModalContext.Provider>
  );
}

function FlowSteps() {
  const steps = [
    {
      icon: Sparkles,
      title: "1. Order placed",
      detail: "Your details land with the CCH operator on duty.",
    },
    {
      icon: Phone,
      title: "2. We call you",
      detail: "Within ~15 minutes to confirm specs and shipping.",
    },
    {
      icon: Receipt,
      title: "3. Invoice sent",
      detail: "Right after the call. Deposit secures the car.",
    },
  ];
  return (
    <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {steps.map((step) => {
        const Icon = step.icon;
        return (
          <div
            key={step.title}
            className="rounded-lg border border-hairline bg-surface-tint/60 px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-white text-cch-red shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <span className="text-[12px] font-semibold text-corporate-black">
                {step.title}
              </span>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-[1.4] text-text-secondary">
              {step.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function SuccessPanel({
  orderId,
  onClose,
}: {
  orderId: string | null;
  onClose: () => void;
}) {
  return (
    <div className="mt-6 rounded-xl bg-emerald-50 p-6 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-700">
        Order placed
      </p>
      <p className="mt-2 font-display text-lg font-semibold text-corporate-black">
        We&apos;re calling you next.
      </p>
      <p className="mt-2 text-sm leading-[1.55] text-text-secondary">
        Keep your phone close. An operator will reach out within ~15 minutes
        to confirm and send your invoice.
      </p>
      {orderId ? (
        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
          Reference · {orderId}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onClose}
        className="mt-5 inline-flex items-center justify-center rounded-button bg-corporate-black px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-corporate-black/90"
      >
        Close
      </button>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
      {children}
    </p>
  );
}

type TextFieldProps = {
  name: FieldKey;
  label: string;
  type?: string;
  inputMode?:
    | "text"
    | "search"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "none";
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  defaultValue?: string;
};

function TextField({
  name,
  label,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  required,
  error,
  hint,
  defaultValue,
}: TextFieldProps) {
  const id = `place-order-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-corporate-black">
        {label}
        {required ? (
          <span className="text-cch-red" aria-hidden="true">
            {" *"}
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-11 rounded-lg border bg-background px-3 text-sm text-corporate-black",
          "focus:outline-none focus:ring-2 focus:ring-cch-red/30",
          error
            ? "border-cch-red focus:border-cch-red"
            : "border-hairline focus:border-corporate-black",
        )}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-cch-red">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-text-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type SelectFieldProps = {
  name: FieldKey;
  label: string;
  options: string[];
  optionLabels?: Record<string, string>;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
};

function SelectField({
  name,
  label,
  options,
  optionLabels,
  defaultValue = "",
  placeholder = "Pick one",
  error,
}: SelectFieldProps) {
  const id = `place-order-${name}`;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-corporate-black">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          "h-11 appearance-none rounded-lg border bg-background px-3 pr-9 text-sm text-corporate-black",
          "bg-[image:linear-gradient(45deg,transparent_50%,rgb(10,10,10)_50%),linear-gradient(135deg,rgb(10,10,10)_50%,transparent_50%)]",
          "bg-[position:calc(100%-15px)_50%,calc(100%-10px)_50%]",
          "bg-[size:5px_5px,5px_5px]",
          "bg-no-repeat",
          "focus:outline-none focus:ring-2 focus:ring-cch-red/30",
          error
            ? "border-cch-red focus:border-cch-red"
            : "border-hairline focus:border-corporate-black",
        )}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((value) => (
          <option key={value} value={value}>
            {optionLabels?.[value] ?? value}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-cch-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextAreaFieldProps = {
  name: FieldKey;
  label: string;
  placeholder?: string;
  error?: string;
};

function TextAreaField({
  name,
  label,
  placeholder,
  error,
}: TextAreaFieldProps) {
  const id = `place-order-${name}`;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-corporate-black">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          "rounded-lg border bg-background px-3 py-2.5 text-sm text-corporate-black",
          "focus:outline-none focus:ring-2 focus:ring-cch-red/30",
          error
            ? "border-cch-red focus:border-cch-red"
            : "border-hairline focus:border-corporate-black",
        )}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-cch-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
