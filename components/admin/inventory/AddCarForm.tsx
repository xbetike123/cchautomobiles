"use client";

import { Check, ChevronDown, ImagePlus, Loader2, X } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { previewScrape } from "@/app/admin/inventory/actions";
import { BRANDS, MODELS_BY_BRAND } from "@/lib/data/vehicles";
import { cn } from "@/lib/utils";
import type { ScrapedCar } from "@/lib/scrapers/carnewschina";
import type { Inventory, InventoryStatus } from "@/lib/admin/types";

const CURRENT_YEAR = new Date().getUTCFullYear();
const YEARS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR + 1 - i);

const BODY_TYPES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Shooting brake",
  "Coupe",
  "MPV",
  "Pickup",
  "Van",
];

const STATUS_OPTIONS: { value: InventoryStatus; label: string }[] = [
  { value: "coming_soon", label: "Coming soon" },
  { value: "on_the_lot", label: "On the lot" },
  { value: "reserved", label: "Reserved" },
  { value: "in_shipping", label: "In shipping" },
  { value: "delivered", label: "Delivered" },
  { value: "sold", label: "Sold" },
  { value: "archived", label: "Archived" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inputClass(extra?: string) {
  return cn(
    "h-11 w-full rounded-lg border border-hairline bg-white px-4 text-[14px] text-corporate-black placeholder:text-text-tertiary focus:border-corporate-black/40 focus:outline-none focus:ring-2 focus:ring-corporate-black/10",
    extra,
  );
}

function selectClass() {
  return cn(
    inputClass(),
    "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%23999%22><path d=%22M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z%22/></svg>')] bg-[length:16px_16px] bg-[position:right_12px_center] bg-no-repeat pr-10",
  );
}

function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        {label}
        {required ? <span className="ml-1 text-cch-red">*</span> : null}
      </span>
      {children}
      {hint ? (
        <span className="text-[11.5px] text-text-tertiary">{hint}</span>
      ) : null}
    </label>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card-lg border border-hairline bg-white p-6 shadow-card md:p-7">
      <header className="mb-5">
        <h2 className="text-[15px] font-semibold tracking-tight text-corporate-black">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-[13px] text-text-secondary">{description}</p>
        ) : null}
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

type AddCarFormProps = {
  initialCar?: Inventory;
};

export function AddCarForm({ initialCar }: AddCarFormProps = {}) {
  const router = useRouter();
  const isEdit = Boolean(initialCar);

  const initialBrandKnown = initialCar
    ? BRANDS.includes(initialCar.brand)
    : false;
  const initialModelKnown =
    initialCar && initialBrandKnown
      ? (MODELS_BY_BRAND[initialCar.brand] ?? []).includes(initialCar.model)
      : false;

  const [brand, setBrand] = useState(
    initialCar ? (initialBrandKnown ? initialCar.brand : "__other__") : "",
  );
  const [customBrand, setCustomBrand] = useState(
    initialCar && !initialBrandKnown ? initialCar.brand : "",
  );
  const [model, setModel] = useState(
    initialCar
      ? initialBrandKnown
        ? initialModelKnown
          ? initialCar.model
          : "__other__"
        : ""
      : "",
  );
  const [customModel, setCustomModel] = useState(
    initialCar && (!initialBrandKnown || !initialModelKnown)
      ? initialCar.model
      : "",
  );
  const [year, setYear] = useState<string>(
    String(initialCar?.year ?? CURRENT_YEAR),
  );
  const [condition, setCondition] = useState<"new" | "used">(
    initialCar?.condition ?? "new",
  );
  const [bodyType, setBodyType] = useState(initialCar?.bodyType ?? "");
  const [priceUsdFob, setPriceUsdFob] = useState<string>(
    initialCar ? String(initialCar.priceUsdFob) : "",
  );

  const [rangeKm, setRangeKm] = useState<string>(
    initialCar?.rangeKm != null ? String(initialCar.rangeKm) : "",
  );
  const [mileageKm, setMileageKm] = useState<string>(
    initialCar?.mileageKm != null ? String(initialCar.mileageKm) : "",
  );
  const [batteryHealth, setBatteryHealth] = useState<string>(
    initialCar?.batteryHealthPct != null
      ? String(initialCar.batteryHealthPct)
      : "",
  );
  const [ownerCount, setOwnerCount] = useState<string>(
    initialCar?.ownerCount != null ? String(initialCar.ownerCount) : "1",
  );
  const [factoryWarrantyMonths, setFactoryWarrantyMonths] = useState<string>(
    initialCar?.factoryWarrantyMonths != null
      ? String(initialCar.factoryWarrantyMonths)
      : "96",
  );

  const [carCode, setCarCode] = useState<string>(initialCar?.carCode ?? "");
  const [status, setStatus] = useState<InventoryStatus>(
    initialCar?.status ?? "coming_soon",
  );
  const [weekAdded, setWeekAdded] = useState<string>(
    initialCar?.weekAdded ?? new Date().toISOString().slice(0, 10),
  );

  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(() => {
    if (!initialCar) return [];
    const urls: string[] = [];
    if (initialCar.heroImageUrl) urls.push(initialCar.heroImageUrl);
    for (const url of initialCar.galleryImageUrls ?? []) {
      if (url && !urls.includes(url)) urls.push(url);
    }
    return urls;
  });
  const [images, setImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [walkaroundVideoUrl, setWalkaroundVideoUrl] = useState(
    initialCar?.walkaroundVideoUrl ?? "",
  );

  const [internalNotes, setInternalNotes] = useState(
    initialCar?.internalNotes ?? "",
  );

  // ---- Spec source (optional carnewschina.com link) ------------------------
  const [sourceUrl, setSourceUrl] = useState("");
  const [scrape, setScrape] = useState<ScrapedCar | null>(null);
  const [selectedTrimIndex, setSelectedTrimIndex] = useState<number | null>(
    null,
  );
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [fetchingSource, startFetchSource] = useTransition();

  const handleFetchSource = () => {
    if (!sourceUrl.trim()) return;
    setSourceError(null);
    startFetchSource(async () => {
      const result = await previewScrape(sourceUrl.trim());
      if (result.ok) {
        setScrape(result.data);
        setSelectedTrimIndex(result.data.trims.length > 0 ? 0 : null);
      } else {
        setScrape(null);
        setSelectedTrimIndex(null);
        setSourceError(result.error);
      }
    });
  };

  const sourceData = useMemo(() => {
    if (!scrape || selectedTrimIndex == null) return null;
    const trim = scrape.trims[selectedTrimIndex];
    if (!trim) return null;
    const specsForTrim: Record<string, string> = {};
    for (const [key, values] of Object.entries(scrape.specs)) {
      const value = values[selectedTrimIndex] ?? "";
      if (value.length > 0) specsForTrim[key] = value;
    }
    return {
      sourceUrl: scrape.sourceUrl,
      pageTitle: scrape.pageTitle,
      trimIndex: selectedTrimIndex,
      trim,
      specs: specsForTrim,
    };
  }, [scrape, selectedTrimIndex]);

  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const detailHref = initialCar
    ? `/admin/inventory/${initialCar.carCode}`
    : "/admin/inventory";
  const cancelHref = detailHref;

  const effectiveBrand = brand === "__other__" ? customBrand.trim() : brand;
  const effectiveModel = model === "__other__" ? customModel.trim() : model;

  const modelOptions = useMemo(() => {
    if (brand === "__other__" || !brand) return [];
    return MODELS_BY_BRAND[brand] ?? [];
  }, [brand]);

  const slug = useMemo(() => {
    const parts = [year, effectiveBrand, effectiveModel].filter(Boolean);
    if (parts.length === 0) return "";
    const base = slugify(parts.join("-"));
    return carCode ? `${base}-${slugify(carCode)}` : base;
  }, [year, effectiveBrand, effectiveModel, carCode]);

  const previews = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images],
  );

  useEffect(() => {
    return () => {
      for (const url of previews) URL.revokeObjectURL(url);
    };
  }, [previews]);

  const addFiles = (incoming: FileList | File[]) => {
    const next: File[] = [];
    for (const file of Array.from(incoming)) {
      if (file.type.startsWith("image/")) next.push(file);
    }
    if (next.length === 0) return;
    setImages((prev) => [...prev, ...next]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImageUrls((prev) => prev.filter((existing) => existing !== url));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const allImageUrls = [...existingImageUrls];
    const payload = {
      brand: effectiveBrand,
      model: effectiveModel,
      year: Number(year),
      condition,
      bodyType: bodyType || null,
      priceUsdFob: Number(priceUsdFob),
      rangeKm: rangeKm ? Number(rangeKm) : null,
      mileageKm: condition === "used" && mileageKm ? Number(mileageKm) : null,
      batteryHealthPct:
        condition === "used" && batteryHealth ? Number(batteryHealth) : null,
      ownerCount: condition === "used" && ownerCount ? Number(ownerCount) : null,
      factoryWarrantyMonths:
        condition === "new" && factoryWarrantyMonths
          ? Number(factoryWarrantyMonths)
          : null,
      carCode: carCode || null,
      slug,
      status,
      weekAdded,
      heroImageUrl: allImageUrls[0] ?? null,
      keptGalleryImageUrls: allImageUrls.slice(1),
      newImages: images,
      walkaroundVideoUrl: walkaroundVideoUrl || null,
      internalNotes: internalNotes || null,
      sourceUrl: sourceData?.sourceUrl ?? null,
      sourceData: sourceData ?? null,
    };

    // Wire to a server action when the admin write layer is built.
    console.log(
      isEdit
        ? `[admin/inventory] update ${initialCar?.id}`
        : "[admin/inventory] add car",
      payload,
    );

    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="rounded-card-lg border border-emerald-200 bg-emerald-50 p-8 text-center shadow-card">
        <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-[18px] font-semibold text-corporate-black">
          {isEdit ? "Vehicle updated" : "Vehicle queued"}
        </h2>
        <p className="mt-1 text-[13.5px] text-text-secondary">
          {isEdit
            ? `${effectiveBrand} ${effectiveModel} (${year}) changes were logged. Persist to Supabase runs once the admin write layer is wired.`
            : `${effectiveBrand} ${effectiveModel} (${year}) was logged. Persist to Supabase will run once the admin write layer is wired.`}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={detailHref}
            className="inline-flex items-center rounded-full bg-cch-red px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_14px_rgba(230,57,70,0.25)] hover:bg-cch-red-hover"
          >
            {isEdit ? "Back to car" : "Back to inventory"}
          </Link>
          {isEdit ? (
            <Link
              href="/admin/inventory"
              className="inline-flex items-center rounded-full border border-hairline bg-white px-5 py-2.5 text-[13px] font-semibold text-corporate-black hover:bg-corporate-black hover:text-white"
            >
              All inventory
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => router.refresh()}
              className="inline-flex items-center rounded-full border border-hairline bg-white px-5 py-2.5 text-[13px] font-semibold text-corporate-black hover:bg-corporate-black hover:text-white"
            >
              Add another car
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-12">
      <Section
        title="Basics"
        description="Identity, year, and trim. Brand and model populate the public lot page."
      >
        <Field label="Brand" required>
          <select
            required
            value={brand}
            onChange={(event) => {
              setBrand(event.target.value);
              setModel("");
            }}
            className={selectClass()}
          >
            <option value="" disabled>
              Select a brand
            </option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
            <option value="__other__">Other (type below)</option>
          </select>
        </Field>

        {brand === "__other__" ? (
          <Field label="Custom brand" required>
            <input
              required
              value={customBrand}
              onChange={(event) => setCustomBrand(event.target.value)}
              placeholder="e.g. New Chinese brand"
              className={inputClass()}
            />
          </Field>
        ) : (
          <Field label="Model" required>
            {modelOptions.length > 0 ? (
              <select
                required
                value={model}
                onChange={(event) => setModel(event.target.value)}
                disabled={!brand}
                className={selectClass()}
              >
                <option value="" disabled>
                  {brand ? "Select a model" : "Pick a brand first"}
                </option>
                {modelOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
                <option value="__other__">Other (type below)</option>
              </select>
            ) : (
              <input
                required
                value={customModel}
                onChange={(event) => setCustomModel(event.target.value)}
                placeholder="Model name"
                className={inputClass()}
              />
            )}
          </Field>
        )}

        {brand !== "__other__" && model === "__other__" ? (
          <Field label="Custom model" required>
            <input
              required
              value={customModel}
              onChange={(event) => setCustomModel(event.target.value)}
              placeholder="e.g. New trim"
              className={inputClass()}
            />
          </Field>
        ) : null}

        <Field label="Year" required>
          <select
            required
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className={selectClass()}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Condition" required>
          <div className="inline-flex h-11 items-center gap-1 rounded-full border border-hairline bg-white p-1">
            {(["new", "used"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCondition(value)}
                className={cn(
                  "inline-flex flex-1 items-center justify-center rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                  condition === value
                    ? "bg-cch-red text-white shadow-[0_6px_14px_rgba(230,57,70,0.28)]"
                    : "text-text-secondary hover:text-corporate-black",
                )}
              >
                {value === "new" ? "New" : "Used"}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Body type">
          <select
            value={bodyType}
            onChange={(event) => setBodyType(event.target.value)}
            className={selectClass()}
          >
            <option value="">Not specified</option>
            {BODY_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Price (USD, FOB Guangzhou)" required>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-text-tertiary">
              $
            </span>
            <input
              required
              type="number"
              inputMode="decimal"
              min={0}
              step={100}
              value={priceUsdFob}
              onChange={(event) => setPriceUsdFob(event.target.value)}
              placeholder="e.g. 28500"
              className={inputClass("pl-8")}
            />
          </div>
        </Field>
      </Section>

      <Section
        title="Specs"
        description="Specifications shown on the spec table. Used cars get inspection fields."
      >
        <Field label="Manufacturer range (km)">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={rangeKm}
            onChange={(event) => setRangeKm(event.target.value)}
            placeholder="e.g. 650"
            className={inputClass()}
          />
        </Field>

        {condition === "used" ? (
          <>
            <Field label="Mileage (km)">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={mileageKm}
                onChange={(event) => setMileageKm(event.target.value)}
                placeholder="e.g. 28400"
                className={inputClass()}
              />
            </Field>
            <Field label="Battery health (%)">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={100}
                value={batteryHealth}
                onChange={(event) => setBatteryHealth(event.target.value)}
                placeholder="e.g. 94"
                className={inputClass()}
              />
            </Field>
            <Field label="Prior owners">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={10}
                value={ownerCount}
                onChange={(event) => setOwnerCount(event.target.value)}
                className={inputClass()}
              />
            </Field>
          </>
        ) : (
          <Field
            label="Factory warranty (months)"
            hint="Remaining months on the manufacturer warranty"
          >
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={factoryWarrantyMonths}
              onChange={(event) =>
                setFactoryWarrantyMonths(event.target.value)
              }
              className={inputClass()}
            />
          </Field>
        )}
      </Section>

      <Section
        title="Status &amp; code"
        description="Internal tracking. Slug is derived from year, brand, model, and code."
      >
        <Field label="Status">
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as InventoryStatus)
            }
            className={selectClass()}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Car code" hint="Optional. CCH-#### internal code">
          <input
            value={carCode}
            onChange={(event) => setCarCode(event.target.value)}
            placeholder="CCH-1042"
            className={inputClass()}
          />
        </Field>

        <Field label="Added to lot">
          <input
            type="date"
            value={weekAdded}
            onChange={(event) => setWeekAdded(event.target.value)}
            className={inputClass()}
          />
        </Field>

        <Field
          label="Public slug (preview)"
          hint="Auto-generated. Editable once the write layer ships."
        >
          <input
            readOnly
            value={slug || "fill basics to generate"}
            className={cn(inputClass(), "bg-surface-tint text-text-secondary")}
          />
        </Field>
      </Section>

      <Section
        title="Media"
        description="Upload exterior, interior, and detail shots. The first image becomes the hero on the lot."
      >
        <Field
          label="Images"
          hint="JPG or PNG · drag and drop or click to upload. Multiple files supported."
          className="md:col-span-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              if (event.target.files) addFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragActive(false);
              if (event.dataTransfer.files)
                addFiles(event.dataTransfer.files);
            }}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-surface-tint/40 px-6 py-10 text-center transition-colors",
              dragActive
                ? "border-cch-red bg-cch-red-soft/60"
                : "border-hairline hover:border-corporate-black/30 hover:bg-surface-tint/70",
            )}
          >
            <span
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-full bg-white text-corporate-black shadow-[0_1px_0_rgba(15,23,42,0.04)]"
            >
              <ImagePlus className="size-5" />
            </span>
            <span className="text-[14px] font-medium text-corporate-black">
              {existingImageUrls.length === 0 && images.length === 0
                ? "Click to upload or drop images here"
                : "Add more images"}
            </span>
            <span className="text-[12px] text-text-tertiary">
              JPG, PNG, or WebP. First image becomes the hero.
            </span>
          </button>

          {existingImageUrls.length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
                On file ({existingImageUrls.length})
              </p>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {existingImageUrls.map((url, idx) => (
                  <li
                    key={url}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg border border-hairline bg-surface-tint"
                  >
                    <NextImage
                      src={url}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover"
                    />
                    {idx === 0 ? (
                      <span className="absolute left-2 top-2 inline-flex items-center rounded-full bg-cch-red px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-white">
                        Hero
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      aria-label="Remove image"
                      className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-corporate-black/85 text-white opacity-0 transition-opacity hover:bg-cch-red [li:hover_&]:opacity-100"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {images.length > 0 ? (
            <div className="mt-4">
              {existingImageUrls.length > 0 ? (
                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
                  New uploads ({images.length})
                </p>
              ) : null}
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {images.map((file, idx) => (
                  <li
                    key={`${file.name}-${file.lastModified}-${idx}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg border border-hairline bg-surface-tint"
                  >
                    <NextImage
                      src={previews[idx]}
                      alt={file.name}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      unoptimized
                      className="object-cover"
                    />
                    {idx === 0 && existingImageUrls.length === 0 ? (
                      <span className="absolute left-2 top-2 inline-flex items-center rounded-full bg-cch-red px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-white">
                        Hero
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      aria-label={`Remove ${file.name}`}
                      className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-corporate-black/85 text-white opacity-0 transition-opacity hover:bg-cch-red [li:hover_&]:opacity-100"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                    <p className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-corporate-black/85 to-transparent px-2 pb-1.5 pt-4 text-[10.5px] text-white">
                      {file.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Field>

        <Field label="Walkaround video URL" className="md:col-span-2">
          <input
            type="url"
            value={walkaroundVideoUrl}
            onChange={(event) => setWalkaroundVideoUrl(event.target.value)}
            placeholder="https://… mp4 or HLS"
            className={inputClass()}
          />
        </Field>
      </Section>

      <Section
        title="Spec source"
        description="Optional. Paste a carnewschina.com /params URL to attach the full manufacturer spec set to this car. The customer-facing page renders it under the standard spec table."
      >
        <Field
          label="Source URL"
          hint="e.g. https://data.carnewschina.com/database/aion/aion-s/2026/params"
          className="md:col-span-2"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="url"
              value={sourceUrl}
              onChange={(event) => {
                setSourceUrl(event.target.value);
                setSourceError(null);
              }}
              placeholder="https://data.carnewschina.com/database/…/params"
              className={inputClass()}
            />
            <button
              type="button"
              onClick={handleFetchSource}
              disabled={fetchingSource || sourceUrl.trim().length === 0}
              className={cn(
                "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-corporate-black bg-corporate-black px-5 text-[13px] font-semibold text-white transition-colors hover:bg-corporate-black/90",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              {fetchingSource ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {fetchingSource ? "Fetching…" : "Fetch specs"}
            </button>
          </div>
        </Field>

        {sourceError ? (
          <div
            role="alert"
            className="md:col-span-2 rounded-lg border border-cch-red px-3 py-2 text-[12.5px] text-cch-red"
          >
            {sourceError}
          </div>
        ) : null}

        {scrape ? (
          <div className="md:col-span-2 space-y-3">
            <div className="rounded-lg border border-hairline bg-surface-tint/60 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
                Pulled from {new URL(scrape.sourceUrl).host}
              </p>
              <p className="mt-1 text-[13.5px] font-medium text-corporate-black">
                {scrape.pageTitle}
              </p>
              <p className="mt-0.5 text-[12px] text-text-secondary">
                {scrape.trims.length} trims · {Object.keys(scrape.specs).length} spec rows
              </p>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
                Which trim do these specs match?
              </p>
              <ul className="space-y-1.5">
                {scrape.trims.map((trim, i) => (
                  <li key={i}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors",
                        selectedTrimIndex === i
                          ? "border-corporate-black bg-white"
                          : "border-hairline bg-white hover:border-corporate-black/40",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="trim-pick"
                          checked={selectedTrimIndex === i}
                          onChange={() => setSelectedTrimIndex(i)}
                          className="size-4 text-cch-red focus:ring-cch-red/30"
                        />
                        <span className="text-[13.5px] font-medium text-corporate-black">
                          {trim.name}
                        </span>
                      </span>
                      <span className="text-[12.5px] text-text-secondary">
                        {trim.priceUsd != null
                          ? `$${trim.priceUsd.toLocaleString()}`
                          : "—"}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {sourceData ? (
              <div className="rounded-lg border border-hairline bg-white">
                <p className="border-b border-hairline px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
                  Preview ({Object.keys(sourceData.specs).length} specs will save)
                </p>
                <ul className="max-h-[260px] divide-y divide-hairline overflow-y-auto">
                  {Object.entries(sourceData.specs)
                    .slice(0, 60)
                    .map(([name, value]) => (
                      <li
                        key={name}
                        className="grid grid-cols-[180px_1fr] gap-3 px-4 py-1.5 text-[12.5px]"
                      >
                        <span className="text-text-tertiary">{name}</span>
                        <span className="text-corporate-black">{value}</span>
                      </li>
                    ))}
                </ul>
                {Object.keys(sourceData.specs).length > 60 ? (
                  <p className="border-t border-hairline px-4 py-2 text-[11px] text-text-tertiary">
                    + {Object.keys(sourceData.specs).length - 60} more rows
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </Section>

      <Section title="Internal notes">
        <Field
          label="Notes (admin only, not shown publicly)"
          className="md:col-span-2"
        >
          <textarea
            value={internalNotes}
            onChange={(event) => setInternalNotes(event.target.value)}
            placeholder="Battery pack inspected 2026-05-08, clean. Customer requested LFP."
            rows={4}
            className={cn(
              inputClass(),
              "h-auto resize-y py-3 leading-[1.5]",
            )}
          />
        </Field>
      </Section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-hairline bg-white/85 px-4 py-4 backdrop-blur-md md:-mx-6 md:px-6">
        <Link
          href={cancelHref}
          className="inline-flex items-center rounded-full border border-hairline bg-white px-5 py-2.5 text-[13px] font-semibold text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-cch-red px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.28)] transition-all hover:bg-cch-red-hover",
            submitting && "cursor-progress opacity-70",
          )}
        >
          {submitting ? (
            <span
              aria-hidden="true"
              className="size-3.5 animate-spin rounded-full border-2 border-white/50 border-t-white"
            />
          ) : (
            <ChevronDown
              aria-hidden="true"
              className="size-3.5 rotate-[-90deg]"
            />
          )}
          {submitting ? "Saving" : isEdit ? "Save changes" : "Save vehicle"}
        </button>
      </div>
    </form>
  );
}
