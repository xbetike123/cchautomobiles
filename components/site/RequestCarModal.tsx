"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Upload, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { submitRequestCar, type RequestCarResult } from "@/app/actions/request-car";
import { cn } from "@/lib/utils";

type ModalContextValue = {
  open: () => void;
};

const RequestCarModalContext = createContext<ModalContextValue | null>(null);

export function useRequestCarModal() {
  const ctx = useContext(RequestCarModalContext);
  if (!ctx) {
    throw new Error(
      "useRequestCarModal must be used inside <RequestCarModalProvider>",
    );
  }
  return ctx;
}

type FieldKey =
  | "name"
  | "email"
  | "whatsapp"
  | "preferred_brand"
  | "preferred_model"
  | "cch_car_code"
  | "reference_image";
type FieldErrors = Partial<Record<FieldKey, string>>;
type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  children: ReactNode;
  brandOptions: string[];
};

const NOT_SURE_VALUE = "__not_sure__";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif";

export function RequestCarModalProvider({ children, brandOptions }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [, startTransition] = useTransition();

  const reset = useCallback(() => {
    setStatus("idle");
    setFormError(null);
    setFieldErrors({});
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setIsOpen(next);
      if (!next) setTimeout(reset, 200);
    },
    [reset],
  );

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > MAX_IMAGE_BYTES) {
      setFieldErrors((prev) => ({
        ...prev,
        reference_image: "Image is too large (max 5MB).",
      }));
      setSelectedFile(null);
      event.target.value = "";
      return;
    }
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.reference_image;
      return next;
    });
    setSelectedFile(file);
  }, []);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.reference_image;
      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);

      const brand = data.get("preferred_brand");
      if (brand === NOT_SURE_VALUE) {
        data.set("preferred_brand", "");
      }

      if (!selectedFile) {
        data.delete("reference_image");
      }

      setStatus("submitting");
      setFormError(null);
      setFieldErrors({});

      startTransition(async () => {
        const result: RequestCarResult = await submitRequestCar(data);
        if (result.ok) {
          setStatus("success");
          form.reset();
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        setStatus("error");
        setFormError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
      });
    },
    [selectedFile],
  );

  const value = useMemo<ModalContextValue>(
    () => ({
      open: () => {
        reset();
        setIsOpen(true);
      },
    }),
    [reset],
  );

  const submitting = status === "submitting";

  return (
    <RequestCarModalContext.Provider value={value}>
      {children}
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-corporate-black/40 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity duration-200" />
          <Dialog.Popup
            className={cn(
              "fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto",
              "rounded-2xl bg-background p-7 shadow-[0_24px_60px_rgba(10,10,10,0.18)]",
              "transition-all duration-200",
              "data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98]",
              "data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.98]",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-meta text-cch-red">Request a Car</p>
                <Dialog.Title className="mt-2 font-display text-2xl font-semibold leading-tight text-corporate-black">
                  Found a car you like?
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm leading-[1.55] text-text-secondary">
                  Send us the details and we&apos;ll get you a full quote
                  within 24 hours.
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
              <div className="mt-6 rounded-xl bg-surface-tint p-6 text-center">
                <p className="font-display text-lg font-semibold text-corporate-black">
                  Request received.
                </p>
                <p className="mt-2 text-sm leading-[1.55] text-text-secondary">
                  Our Guangzhou team will reach out on WhatsApp within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="mt-5 inline-flex items-center justify-center rounded-button bg-corporate-black px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-corporate-black/90"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-4"
                noValidate
              >
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
                </div>

                <TextField
                  name="whatsapp"
                  label="WhatsApp number"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+234 …"
                  required
                  error={fieldErrors.whatsapp}
                  hint="Include your country code."
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SelectField
                    name="preferred_brand"
                    label="Brand"
                    options={brandOptions}
                    error={fieldErrors.preferred_brand}
                  />
                  <TextField
                    name="preferred_model"
                    label="Model"
                    placeholder="e.g. Atto 3, G6"
                    error={fieldErrors.preferred_model}
                  />
                </div>

                <TextField
                  name="cch_car_code"
                  label="CCH car code"
                  placeholder="e.g. CCH-2026-014"
                  hint="If you saw one of our posts, paste the code here."
                  error={fieldErrors.cch_car_code}
                />

                <FileField
                  ref={fileInputRef}
                  selectedFile={selectedFile}
                  onChange={handleFileChange}
                  onClear={clearFile}
                  error={fieldErrors.reference_image}
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
                    "mt-2 inline-flex items-center justify-center rounded-button bg-cch-red px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.28)] transition-colors hover:bg-cch-red-hover",
                    "disabled:cursor-not-allowed disabled:opacity-70",
                  )}
                >
                  {submitting ? "Sending…" : "Send request"}
                </button>
                <p className="text-center text-[11px] leading-snug text-text-secondary">
                  By submitting, you agree to be contacted by the CCH operations
                  team about your request.
                </p>
              </form>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </RequestCarModalContext.Provider>
  );
}

type TextFieldProps = {
  name: FieldKey;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
};

function TextField({
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  required,
  error,
  hint,
}: TextFieldProps) {
  const id = `request-car-${name}`;
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
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
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
  error?: string;
};

function SelectField({ name, label, options, error }: SelectFieldProps) {
  const id = `request-car-${name}`;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-corporate-black">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          "h-11 appearance-none rounded-lg border bg-background bg-[length:0.75rem] bg-[right_0.85rem_center] bg-no-repeat px-3 pr-9 text-sm text-corporate-black",
          "bg-[image:linear-gradient(45deg,transparent_50%,rgb(10,10,10)_50%),linear-gradient(135deg,rgb(10,10,10)_50%,transparent_50%)]",
          "bg-[position:calc(100%-15px)_50%,calc(100%-10px)_50%]",
          "bg-[size:5px_5px,5px_5px]",
          "focus:outline-none focus:ring-2 focus:ring-cch-red/30",
          error
            ? "border-cch-red focus:border-cch-red"
            : "border-hairline focus:border-corporate-black",
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
        <p id={errorId} role="alert" className="text-xs text-cch-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type FileFieldProps = {
  ref: React.Ref<HTMLInputElement>;
  selectedFile: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  error?: string;
};

function FileField({
  ref,
  selectedFile,
  onChange,
  onClear,
  error,
}: FileFieldProps) {
  const id = "request-car-reference_image";
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-corporate-black">
        Reference image
      </label>
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border border-dashed bg-surface-tint/60 px-3 py-2.5",
          error ? "border-cch-red" : "border-hairline",
        )}
      >
        <label
          htmlFor={id}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-background px-3 py-2 text-xs font-medium text-corporate-black shadow-sm hover:bg-white"
        >
          <Upload className="size-3.5" aria-hidden="true" />
          {selectedFile ? "Replace image" : "Upload image"}
        </label>
        <div className="min-w-0 flex-1 text-xs text-text-secondary">
          {selectedFile ? (
            <span className="block truncate">{selectedFile.name}</span>
          ) : (
            <span>JPEG, PNG, WEBP or HEIC. Max 5MB.</span>
          )}
        </div>
        {selectedFile ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Remove image"
            className="inline-flex size-7 items-center justify-center rounded-full text-corporate-black/60 hover:bg-background hover:text-corporate-black"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <input
        ref={ref}
        id={id}
        name="reference_image"
        type="file"
        accept={IMAGE_ACCEPT}
        onChange={onChange}
        className="sr-only"
        aria-describedby={errorId}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-cch-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
