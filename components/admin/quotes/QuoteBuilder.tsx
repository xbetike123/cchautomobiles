"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  ImagePlus,
  Loader2,
  Mail,
  Pencil,
  Plus,
  Save,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { previewScrape } from "@/app/admin/inventory/actions";
import {
  saveQuoteDraft,
  sendQuoteFromBuilder,
} from "@/app/admin/quotes/new/actions";
import { QuoteSummary } from "@/components/admin/quotes/QuoteSummary";
import { formatUsd } from "@/lib/admin/format";
import type {
  Inventory,
  Lead,
  QuotePaymentOption,
  QuoteKind,
  QuoteVehicle,
} from "@/lib/admin/types";
import type { ScrapedCar } from "@/lib/scrapers/carnewschina";
import { cn } from "@/lib/utils";

// Shipping, clearing, and export licence are entered per order — they vary
// by destination port, vehicle size, and current regulations. No defaults.
const QUOTE_VALID_DAYS = 7;
const QUOTE_DRAFT_STORAGE_KEY = "cch:admin:quote-builder:v1";
const QUOTE_DRAFT_DB = "cch-admin-drafts";
const QUOTE_VEHICLES_STORE = "quote-vehicles";

function openDraftDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(QUOTE_DRAFT_DB, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(QUOTE_VEHICLES_STORE)) {
        request.result.createObjectStore(QUOTE_VEHICLES_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadVehicleDraft(): Promise<QuoteVehicle[] | null> {
  const db = await openDraftDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(QUOTE_VEHICLES_STORE, "readonly");
    const request = transaction.objectStore(QUOTE_VEHICLES_STORE).get("vehicles");
    request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result as QuoteVehicle[] : null);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function saveVehicleDraft(vehicles: QuoteVehicle[]): Promise<void> {
  const db = await openDraftDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(QUOTE_VEHICLES_STORE, "readwrite");
    transaction.objectStore(QUOTE_VEHICLES_STORE).put(vehicles, "vehicles");
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}

type Mode = "matched" | "manual";

type QuoteBuilderProps = {
  initialLead: Lead | null;
  initialInventory: Inventory | null;
  leads: Lead[];
  inventory: Inventory[];
  initialQuoteKind?: QuoteKind;
};

export function QuoteBuilder({
  initialLead,
  initialInventory,
  leads: initialLeads,
  inventory,
  initialQuoteKind = "purchase",
}: QuoteBuilderProps) {
  const quoteKind = initialQuoteKind;
  // Leads live in state so a quote can be built for a brand-new client
  // added right here, without leaving the page. Newly added leads are
  // session-local until a persistence layer exists (see addNewLead).
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [finishedAddingCars, setFinishedAddingCars] = useState(false);

  // Default-select the first lead so the builder opens with previewable
  // mock data (see the mock pricing defaults below).
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    initialLead?.id ?? initialLeads[0]?.id ?? "",
  );

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedLeadId) ?? null,
    [leads, selectedLeadId],
  );

  // When a lead is picked, try to match its car code to inventory.
  const matchedInventory = useMemo(() => {
    if (!selectedLead?.carCode) return null;
    return inventory.find((i) => i.carCode === selectedLead.carCode) ?? null;
  }, [inventory, selectedLead]);

  // Each car in a multi-car quote can independently select an inventory item.
  // `null` means use the lead's automatic match; an empty string means the
  // admin is choosing a fresh vehicle after saving the previous car.
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(
    initialInventory?.id ?? null,
  );
  const activeInventory = useMemo(
    () => selectedInventoryId === null
      ? matchedInventory
      : inventory.find((item) => item.id === selectedInventoryId) ?? null,
    [inventory, matchedInventory, selectedInventoryId],
  );
  const [inventoryBaseUsd, setInventoryBaseUsd] = useState(
    String(initialInventory?.priceUsdFob ?? matchedInventory?.priceUsdFob ?? ""),
  );

  const [mode, setMode] = useState<Mode>(
    initialInventory ? "matched" : "manual",
  );

  // Manual car fields (used when mode === "manual" or no match).
  // Pre-filled with mock values so the page opens with a previewable quote.
  const [manualBrand, setManualBrand] = useState<string>("BYD");
  const [manualModel, setManualModel] = useState<string>("Atto 3");
  const [manualYear, setManualYear] = useState<string>("2026");
  const [manualCondition, setManualCondition] = useState<"new" | "used">(
    "new",
  );
  const [manualBaseUsd, setManualBaseUsd] = useState<string>("18900");
  const [vehiclePowertrain, setVehiclePowertrain] = useState("");
  const [vehicleExteriorColor, setVehicleExteriorColor] = useState("");
  const [vehicleInteriorColor, setVehicleInteriorColor] = useState("");
  const [vehicleVin, setVehicleVin] = useState("");
  const [vehicleQuantity, setVehicleQuantity] = useState("1");

  // Pricing inputs — pre-filled with mock values for the preview.
  const [shippingUsd, setShippingUsd] = useState<string>("");
  const [clearingUsd, setClearingUsd] = useState<string>("1800");
  const [clearingTbc, setClearingTbc] = useState<boolean>(false);
  const [purchaseTaxUsd, setPurchaseTaxUsd] = useState<string>("");
  const [exportLicenseUsd, setExportLicenseUsd] = useState<string>("1500");

  const [personalNote, setPersonalNote] = useState<string>("");
  const [paymentOption, setPaymentOption] =
    useState<QuotePaymentOption>("full_payment");
  const [accountInformation, setAccountInformation] = useState<string>("");
  const [bookingAccountNumber, setBookingAccountNumber] = useState("");
  const [bookingCurrency, setBookingCurrency] = useState("NGN");
  const [bookingAmountLocal, setBookingAmountLocal] = useState("");
  const [addedVehicles, setAddedVehicles] = useState<QuoteVehicle[]>([]);
  const [editingVehicle, setEditingVehicle] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [vehicleDraftRestored, setVehicleDraftRestored] = useState(false);

  // ---- Spec source (optional carnewschina.com link) ----
  // Paste a /params URL, pick a trim, and the full manufacturer spec set is
  // attached to the generated quote PDF (Specifications section).
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [scrape, setScrape] = useState<ScrapedCar | null>(null);
  const [selectedTrimIndex, setSelectedTrimIndex] = useState<number | null>(
    null,
  );
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [fetchingSource, startFetchSource] = useTransition();

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(QUOTE_DRAFT_STORAGE_KEY);
        if (saved) {
          const draft = JSON.parse(saved) as Record<string, unknown>;
          if (typeof draft.selectedLeadId === "string") setSelectedLeadId(draft.selectedLeadId);
          if (Array.isArray(draft.sessionLeads)) {
            setLeads((current) => {
              const restored = draft.sessionLeads as Lead[];
              const existingIds = new Set(current.map((lead) => lead.id));
              return [...restored.filter((lead) => !existingIds.has(lead.id)), ...current];
            });
          }
          if (typeof draft.finishedAddingCars === "boolean") setFinishedAddingCars(draft.finishedAddingCars);
          if (draft.mode === "matched" || draft.mode === "manual") setMode(draft.mode);
          if (typeof draft.selectedInventoryId === "string") setSelectedInventoryId(draft.selectedInventoryId);
          if (typeof draft.inventoryBaseUsd === "string") setInventoryBaseUsd(draft.inventoryBaseUsd);
          if (typeof draft.manualBrand === "string") setManualBrand(draft.manualBrand);
          if (typeof draft.manualModel === "string") setManualModel(draft.manualModel);
          if (typeof draft.manualYear === "string") setManualYear(draft.manualYear);
          if (draft.manualCondition === "new" || draft.manualCondition === "used") setManualCondition(draft.manualCondition);
          if (typeof draft.manualBaseUsd === "string") setManualBaseUsd(draft.manualBaseUsd);
          if (typeof draft.vehiclePowertrain === "string") setVehiclePowertrain(draft.vehiclePowertrain);
          if (typeof draft.vehicleExteriorColor === "string") setVehicleExteriorColor(draft.vehicleExteriorColor);
          if (typeof draft.vehicleInteriorColor === "string") setVehicleInteriorColor(draft.vehicleInteriorColor);
          if (typeof draft.vehicleVin === "string") setVehicleVin(draft.vehicleVin);
          if (typeof draft.vehicleQuantity === "string") setVehicleQuantity(draft.vehicleQuantity);
          if (typeof draft.shippingUsd === "string") setShippingUsd(draft.shippingUsd);
          if (typeof draft.clearingUsd === "string") setClearingUsd(draft.clearingUsd);
          if (typeof draft.clearingTbc === "boolean") setClearingTbc(draft.clearingTbc);
          if (typeof draft.purchaseTaxUsd === "string") setPurchaseTaxUsd(draft.purchaseTaxUsd);
          if (typeof draft.exportLicenseUsd === "string") setExportLicenseUsd(draft.exportLicenseUsd);
          if (typeof draft.personalNote === "string") setPersonalNote(draft.personalNote);
          if (draft.paymentOption === "full_payment" || draft.paymentOption === "deposit" || draft.paymentOption === "local_payment") setPaymentOption(draft.paymentOption);
          if (typeof draft.accountInformation === "string") setAccountInformation(draft.accountInformation);
          if (typeof draft.bookingAccountNumber === "string") setBookingAccountNumber(draft.bookingAccountNumber);
          if (typeof draft.bookingCurrency === "string") setBookingCurrency(draft.bookingCurrency);
          if (typeof draft.bookingAmountLocal === "string") setBookingAmountLocal(draft.bookingAmountLocal);
          if (typeof draft.sourceUrl === "string") setSourceUrl(draft.sourceUrl);
        }
      } catch {
        window.localStorage.removeItem(QUOTE_DRAFT_STORAGE_KEY);
      } finally {
        setDraftRestored(true);
      }
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void loadVehicleDraft()
      .then((vehicles) => {
        if (!cancelled && vehicles?.length) setAddedVehicles(vehicles);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setVehicleDraftRestored(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!draftRestored || !vehicleDraftRestored) return;
    window.localStorage.setItem(QUOTE_DRAFT_STORAGE_KEY, JSON.stringify({
      selectedLeadId, mode, selectedInventoryId, inventoryBaseUsd, manualBrand, manualModel, manualYear,
      sessionLeads: leads.filter((lead) => lead.id.startsWith("lead-new-")), finishedAddingCars,
      manualCondition, manualBaseUsd, shippingUsd, clearingUsd, clearingTbc,
      vehiclePowertrain, vehicleExteriorColor, vehicleInteriorColor, vehicleVin, vehicleQuantity,
      purchaseTaxUsd, exportLicenseUsd, personalNote, paymentOption,
      accountInformation, bookingAccountNumber, bookingCurrency, bookingAmountLocal, sourceUrl,
      addedVehicles: addedVehicles.map((vehicle) => ({ ...vehicle, photoUrls: [] })),
    }));
    void saveVehicleDraft(addedVehicles).catch(() => undefined);
  }, [
    draftRestored, vehicleDraftRestored, selectedLeadId, leads, finishedAddingCars, mode, selectedInventoryId, inventoryBaseUsd, manualBrand, manualModel, manualYear,
    manualCondition, manualBaseUsd, shippingUsd, clearingUsd, clearingTbc,
    vehiclePowertrain, vehicleExteriorColor, vehicleInteriorColor, vehicleVin, vehicleQuantity,
    purchaseTaxUsd, exportLicenseUsd, personalNote, paymentOption,
    accountInformation, bookingAccountNumber, bookingCurrency, bookingAmountLocal, sourceUrl, addedVehicles,
  ]);

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

  // The selected trim's column from the scraped spec map, attached to the PDF.
  const quoteSpecs = useMemo(() => {
    if (!scrape || selectedTrimIndex == null) return null;
    const out: Record<string, string> = {};
    for (const [key, values] of Object.entries(scrape.specs)) {
      const value = values[selectedTrimIndex] ?? "";
      if (value.length > 0) out[key] = value;
    }
    return Object.keys(out).length > 0 ? out : null;
  }, [scrape, selectedTrimIndex]);

  // ---- Attached photos ----
  // Images attached to the quote, held as base64 data URLs so they can be
  // previewed here and embedded directly into the preview PDF (the renderer
  // decodes data: URLs). The first attachment is used as the vehicle photo.
  const [attachments, setAttachments] = useState<
    { id: string; name: string; dataUrl: string }[]
  >([]);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const attachmentCounter = useRef(0);

  const addAttachments = async (files: FileList | File[]) => {
    const remainingSlots = Math.max(0, 8 - attachments.length);
    const images = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remainingSlots);
    const read = await Promise.all(
      images.map(
        (file) =>
          new Promise<{ id: string; name: string; dataUrl: string } | null>(
            async (resolve) => {
              try {
                const bitmap = await createImageBitmap(file);
                const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.round(bitmap.width * scale));
                canvas.height = Math.max(1, Math.round(bitmap.height * scale));
                const context = canvas.getContext("2d");
                if (!context) throw new Error("Canvas is unavailable");
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                bitmap.close();
                attachmentCounter.current += 1;
                resolve({
                  id: `att-${attachmentCounter.current}`,
                  name: file.name,
                  dataUrl: canvas.toDataURL("image/jpeg", 0.8),
                });
              } catch {
                resolve(null);
              }
            },
          ),
      ),
    );
    const valid = read.filter(
      (a): a is { id: string; name: string; dataUrl: string } =>
        a !== null && a.dataUrl !== "",
    );
    if (valid.length > 0) setAttachments((prev) => [...prev, ...valid]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // ---- Inline "new lead" form ----
  const [showNewLead, setShowNewLead] = useState<boolean>(false);
  const [newLead, setNewLead] = useState({
    name: "",
    whatsapp: "",
    email: "",
    destinationCity: "",
    destinationCountry: "",
    carCode: "",
  });
  const newLeadCounter = useRef(0);

  const newLeadValid = newLead.name.trim() !== "" && newLead.whatsapp.trim() !== "";

  const resetNewLead = () => {
    setNewLead({
      name: "",
      whatsapp: "",
      email: "",
      destinationCity: "",
      destinationCountry: "",
      carCode: "",
    });
  };

  // Create a lead from the inline form, add it to the list, and select it.
  // Session-local for now — wire to a server action once lead persistence
  // exists. All non-essential Lead fields default to empty/unclassified.
  const addNewLead = () => {
    if (!newLeadValid) return;
    newLeadCounter.current += 1;
    const lead: Lead = {
      id: `lead-new-${newLeadCounter.current}`,
      createdAt: new Date().toISOString(),
      name: newLead.name.trim(),
      whatsapp: newLead.whatsapp.trim(),
      email: newLead.email.trim(),
      carCode: newLead.carCode.trim() || null,
      preferredBrand: null,
      preferredModel: null,
      screenshotUrls: [],
      budgetMinUsd: null,
      budgetMaxUsd: null,
      timeline: null,
      conditionPreference: null,
      bodyTypePreferences: [],
      destinationCity: newLead.destinationCity.trim() || null,
      destinationCountry: newLead.destinationCountry.trim() || null,
      notes: null,
      status: "new",
      track: "unclassified",
      sourceDeadline: null,
      waitResponse: "pending",
      waitResponseAt: null,
      autoReplySentAt: null,
      assignedTo: null,
      closedLostReason: null,
      closedWonInventoryId: null,
    };
    setLeads((prev) => [lead, ...prev]);
    setSelectedLeadId(lead.id);
    resetNewLead();
    setShowNewLead(false);
  };

  // Resolve the "active" car for the quote based on the current mode.
  const activeCar = useMemo(() => {
    if (mode === "matched" && activeInventory) {
      return {
        carCode: activeInventory.carCode,
        carName: `${activeInventory.year} ${activeInventory.brand} ${activeInventory.model}`,
        condition: activeInventory.condition,
        photo: activeInventory.heroImageUrl,
        basePriceUsd: Number(inventoryBaseUsd) || 0,
      };
    }
    return {
      carCode: "—",
      carName:
        [manualYear, manualBrand, manualModel].filter(Boolean).join(" ") ||
        "Untitled",
      condition: manualCondition,
      photo: null,
      basePriceUsd: Number(manualBaseUsd) || 0,
    };
  }, [
    activeInventory,
    inventoryBaseUsd,
    mode,
    manualBrand,
    manualModel,
    manualYear,
    manualCondition,
    manualBaseUsd,
  ]);

  // Attached photos take precedence over the matched inventory hero so the
  // admin can override the vehicle image shown on the quote.
  const quotePhotoUrls = useMemo(() => {
    const uploaded = attachments.map((a) => a.dataUrl);
    if (uploaded.length > 0) return uploaded;
    return activeCar.photo ? [activeCar.photo] : [];
  }, [attachments, activeCar.photo]);
  const displayPhoto = quotePhotoUrls[0] ?? null;

  const basePrice = activeCar.basePriceUsd;
  const shippingValue = shippingUsd.trim() === "" ? null : Number(shippingUsd) || 0;
  const clearingValue = clearingTbc ? 0 : Number(clearingUsd) || 0;
  const purchaseTaxValue = Number(purchaseTaxUsd) || 0;
  const exportLicenseValue = Number(exportLicenseUsd) || 0;
  const quantity = Math.max(1, Number(vehicleQuantity) || 1);
  const currentVehicleTotal =
    (basePrice + (shippingValue ?? 0) + clearingValue + purchaseTaxValue + exportLicenseValue) * quantity;

  const currentVehicle: QuoteVehicle = {
    inventoryId: mode === "matched" ? activeInventory?.id ?? null : null,
    carCode: activeCar.carCode,
    carName: activeCar.carName,
    carYear: mode === "matched" && activeInventory
      ? activeInventory.year
      : Number(manualYear) || new Date().getUTCFullYear(),
    carCondition: activeCar.condition,
    photoUrls: quotePhotoUrls,
    basePriceUsd: basePrice,
    shippingUsd: shippingValue,
    purchaseTaxUsd: purchaseTaxValue,
    clearingUsd: clearingTbc ? null : clearingValue,
    serviceFeeUsd: exportLicenseValue,
    totalUsd: currentVehicleTotal,
    powertrain: vehiclePowertrain.trim() || undefined,
    exteriorColor: vehicleExteriorColor.trim() || undefined,
    interiorColor: vehicleInteriorColor.trim() || undefined,
    vin: vehicleVin.trim() || undefined,
    quantity,
    brand: mode === "manual" ? manualBrand.trim() : activeInventory?.brand,
    model: mode === "manual" ? manualModel.trim() : activeInventory?.model,
  };
  const currentVehicleStarted = mode === "matched"
    ? activeInventory !== null
    : [manualBrand, manualModel, manualBaseUsd].some((value) => value.trim() !== "");
  const includeCurrentVehicle = addedVehicles.length === 0 || currentVehicleStarted;
  const shouldIncludeCurrentVehicle = includeCurrentVehicle && !finishedAddingCars;
  const quoteVehicles = shouldIncludeCurrentVehicle
    ? [...addedVehicles, currentVehicle]
    : addedVehicles;
  const primaryVehicle = quoteVehicles[quoteVehicles.length - 1] ?? currentVehicle;
  const totalUsd = quoteVehicles.reduce((sum, vehicle) => sum + vehicle.totalUsd, 0);

  const addAnotherVehicle = () => {
    if (activeCar.basePriceUsd <= 0 || (!clearingTbc && clearingValue <= 0) || exportLicenseValue <= 0) return;
    setAddedVehicles((vehicles) => [...vehicles, currentVehicle]);
    setFinishedAddingCars(editingVehicle);
    setEditingVehicle(false);
    setMode("matched");
    setSelectedInventoryId("");
    setInventoryBaseUsd("");
    setManualBrand("");
    setManualModel("");
    setManualYear(String(new Date().getUTCFullYear()));
    setManualCondition("new");
    setManualBaseUsd("");
    setVehiclePowertrain("");
    setVehicleExteriorColor("");
    setVehicleInteriorColor("");
    setVehicleVin("");
    setVehicleQuantity("1");
    setShippingUsd("");
    setClearingUsd("");
    setClearingTbc(false);
    setPurchaseTaxUsd("");
    setExportLicenseUsd("1500");
    setAttachments([]);
    setSourceUrl("");
    setScrape(null);
    setSelectedTrimIndex(null);
  };

  const editSavedVehicle = (vehicle: QuoteVehicle, index: number) => {
    setAddedVehicles((vehicles) => vehicles.filter((_, vehicleIndex) => vehicleIndex !== index));
    setFinishedAddingCars(false);
    setEditingVehicle(true);
    const inventoryMatch = vehicle.inventoryId
      ? inventory.find((item) => item.id === vehicle.inventoryId) ?? null
      : null;
    if (inventoryMatch) {
      setMode("matched");
      setSelectedInventoryId(inventoryMatch.id);
      setInventoryBaseUsd(String(vehicle.basePriceUsd));
    } else {
      setMode("manual");
      setSelectedInventoryId("");
      const nameWithoutYear = vehicle.carName.replace(new RegExp(`^${vehicle.carYear}\\s*`), "").trim();
      const [fallbackBrand = "", ...fallbackModel] = nameWithoutYear.split(/\s+/);
      setManualBrand(vehicle.brand ?? fallbackBrand);
      setManualModel(vehicle.model ?? fallbackModel.join(" "));
      setManualYear(String(vehicle.carYear));
      setManualCondition(vehicle.carCondition);
      setManualBaseUsd(String(vehicle.basePriceUsd));
    }
    setVehiclePowertrain(vehicle.powertrain ?? "");
    setVehicleExteriorColor(vehicle.exteriorColor ?? "");
    setVehicleInteriorColor(vehicle.interiorColor ?? "");
    setVehicleVin(vehicle.vin ?? "");
    setVehicleQuantity(String(vehicle.quantity ?? 1));
    setShippingUsd(vehicle.shippingUsd == null ? "" : String(vehicle.shippingUsd));
    setClearingTbc(vehicle.clearingUsd == null);
    setClearingUsd(vehicle.clearingUsd == null ? "" : String(vehicle.clearingUsd));
    setPurchaseTaxUsd(String(vehicle.purchaseTaxUsd || ""));
    setExportLicenseUsd(String(vehicle.serviceFeeUsd || ""));
    setAttachments(vehicle.photoUrls.map((url, photoIndex) => ({
      id: `edit-${index}-${photoIndex}-${Date.now()}`,
      name: `Vehicle photo ${photoIndex + 1}`,
      dataUrl: url,
    })));
  };

  const { validUntil, validUntilLabel } = useMemo(() => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + QUOTE_VALID_DAYS);
    return {
      validUntil: d.toISOString().slice(0, 10),
      validUntilLabel: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Africa/Lagos",
      }),
    };
  }, []);

  const missingFields: string[] = [];
  if (!selectedLead) missingFields.push("a lead");
  if (shouldIncludeCurrentVehicle && activeCar.basePriceUsd <= 0) missingFields.push(quoteKind === "pre_sales" ? "the booking cost" : "the FOB price");
  if (shouldIncludeCurrentVehicle && !clearingTbc && clearingValue <= 0) missingFields.push("clearing cost");
  if (shouldIncludeCurrentVehicle && exportLicenseValue <= 0) missingFields.push("export licence cost");
  if ((quoteKind === "pre_sales" || paymentOption === "local_payment") && !bookingAccountNumber.trim()) missingFields.push("the local payment account number");
  if ((quoteKind === "pre_sales" || paymentOption === "local_payment") && (!bookingCurrency.trim() || Number(bookingAmountLocal) <= 0)) missingFields.push("the local-currency payment amount");

  const canGenerate = missingFields.length === 0;

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<
    | { kind: "ok"; quoteId: string }
    | { kind: "error"; message: string }
    | null
  >(null);
  const [sendStatus, setSendStatus] = useState<
    | { kind: "ok"; toEmail: string; mocked: boolean }
    | { kind: "error"; message: string }
    | null
  >(null);

  // Render the live form state to a PDF via the preview route and open it
  // in a new tab. This is the same QuoteDocument that the real send uses,
  // so it's an accurate preview of the customer-facing PDF.
  const generatePdf = async () => {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    setPdfError(null);
    try {
      const res = await fetch("/admin/preview/quote-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead?.id,
          clientName: selectedLead?.name,
          clientWhatsapp: selectedLead?.whatsapp,
          destinationCity: selectedLead?.destinationCity ?? null,
          carCode: primaryVehicle.carCode,
          carName: primaryVehicle.carName,
          carYear: primaryVehicle.carYear,
          carCondition: primaryVehicle.carCondition,
          photoUrls: primaryVehicle.photoUrls,
          basePriceUsd: primaryVehicle.basePriceUsd,
          shippingUsd: primaryVehicle.shippingUsd,
          purchaseTaxUsd: primaryVehicle.purchaseTaxUsd,
          clearingUsd: primaryVehicle.clearingUsd,
          serviceFeeUsd: primaryVehicle.serviceFeeUsd,
          totalUsd,
          vehicles: quoteVehicles,
          quoteKind,
          bookingAccountNumber: bookingAccountNumber || null,
          bookingCurrency: bookingCurrency || null,
          bookingAmountLocal: Number(bookingAmountLocal) || null,
          personalNote: personalNote || null,
          paymentOption,
          accountInformation: accountInformation || null,
          validUntil,
          specs: quoteSpecs,
        }),
      });
      if (!res.ok) throw new Error(`Preview failed (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      // Revoke after a beat so the new tab has time to load the blob.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      console.error("[QuoteBuilder] PDF preview failed:", error);
      setPdfError(
        error instanceof Error ? error.message : "Could not render the PDF.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const emailQuote = async () => {
    if (!canGenerate || isSending) return;
    setIsSending(true);
    setSendStatus(null);
    try {
      const result = await sendQuoteFromBuilder({
        leadId: selectedLead?.id,
        clientName: selectedLead?.name,
        clientWhatsapp: selectedLead?.whatsapp,
        destinationCity: selectedLead?.destinationCity ?? null,
        carCode: primaryVehicle.carCode,
        carName: primaryVehicle.carName,
        carYear: primaryVehicle.carYear,
        carCondition: primaryVehicle.carCondition,
        photoUrls: primaryVehicle.photoUrls,
        basePriceUsd: primaryVehicle.basePriceUsd,
        shippingUsd: primaryVehicle.shippingUsd,
        purchaseTaxUsd: primaryVehicle.purchaseTaxUsd,
        clearingUsd: primaryVehicle.clearingUsd,
        serviceFeeUsd: primaryVehicle.serviceFeeUsd,
        totalUsd,
        vehicles: quoteVehicles,
        quoteKind,
        bookingAccountNumber: bookingAccountNumber || null,
        bookingCurrency: bookingCurrency || null,
        bookingAmountLocal: Number(bookingAmountLocal) || null,
        personalNote: personalNote || null,
        paymentOption,
        accountInformation: accountInformation || null,
        validUntil,
      });
      if (result.ok) {
        setSendStatus({
          kind: "ok",
          toEmail: result.toEmail,
          mocked: result.mocked,
        });
      } else {
        setSendStatus({ kind: "error", message: result.error });
      }
    } catch (error) {
      setSendStatus({
        kind: "error",
        message:
          error instanceof Error ? error.message : "Could not send the quote.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const saveDraft = async () => {
    if (!canGenerate || isSaving) return;
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const result = await saveQuoteDraft({
        leadId: selectedLead?.id,
        clientName: selectedLead?.name,
        clientWhatsapp: selectedLead?.whatsapp,
        clientEmail: selectedLead?.email,
        destinationCity: selectedLead?.destinationCity ?? null,
        destinationCountry: selectedLead?.destinationCountry ?? null,
        inventoryId: primaryVehicle.inventoryId,
        carCode: primaryVehicle.carCode,
        carName: primaryVehicle.carName,
        carYear: primaryVehicle.carYear,
        carCondition: primaryVehicle.carCondition,
        photoUrls: primaryVehicle.photoUrls,
        basePriceUsd: primaryVehicle.basePriceUsd,
        shippingUsd: primaryVehicle.shippingUsd,
        purchaseTaxUsd: primaryVehicle.purchaseTaxUsd,
        clearingUsd: primaryVehicle.clearingUsd,
        serviceFeeUsd: primaryVehicle.serviceFeeUsd,
        totalUsd,
        vehicles: quoteVehicles,
        quoteKind,
        bookingAccountNumber: bookingAccountNumber || null,
        bookingCurrency: bookingCurrency || null,
        bookingAmountLocal: Number(bookingAmountLocal) || null,
        personalNote: personalNote || null,
        paymentOption,
        accountInformation: accountInformation || null,
        validUntil,
      });
      setSaveStatus(
        result.ok
          ? { kind: "ok", quoteId: result.quoteId }
          : { kind: "error", message: result.error },
      );
    } catch (error) {
      setSaveStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Could not save draft.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* ---------- LEFT: form ---------- */}
      <div className="space-y-4">
        {/* Client */}
        <section className="overflow-hidden rounded-xl border border-hairline bg-white">
          <header className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
            <div>
              <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
                Client
              </h2>
              <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                Pick which lead this quote is for
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNewLead((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                  showNewLead
                    ? "border-cch-red/30 bg-cch-red/10 text-cch-red"
                    : "border-hairline bg-white text-text-secondary hover:bg-surface-tint hover:text-corporate-black",
                )}
              >
                <UserPlus className="size-3.5" />
                New lead
              </button>
              <span className="rounded-full bg-corporate-black/5 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-corporate-black/70">
                Step 1
              </span>
            </div>
          </header>

          {showNewLead ? (
            <div className="border-b border-hairline bg-surface-tint/60 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] font-semibold text-corporate-black">
                  Add a new lead
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewLead(false);
                    resetNewLead();
                  }}
                  className="inline-flex size-6 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-corporate-black/5 hover:text-corporate-black"
                  aria-label="Cancel new lead"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <NewLeadField
                  label="Name"
                  required
                  placeholder="e.g. Funmi Adeyemi"
                  value={newLead.name}
                  onChange={(v) => setNewLead((p) => ({ ...p, name: v }))}
                />
                <NewLeadField
                  label="WhatsApp"
                  required
                  placeholder="e.g. +234 802 000 0000"
                  value={newLead.whatsapp}
                  onChange={(v) => setNewLead((p) => ({ ...p, whatsapp: v }))}
                />
                <NewLeadField
                  label="Email"
                  type="email"
                  placeholder="e.g. funmi@email.com"
                  value={newLead.email}
                  onChange={(v) => setNewLead((p) => ({ ...p, email: v }))}
                />
                <NewLeadField
                  label="Car code (optional)"
                  placeholder="e.g. CCH-1039"
                  value={newLead.carCode}
                  onChange={(v) => setNewLead((p) => ({ ...p, carCode: v }))}
                />
                <NewLeadField
                  label="Destination city"
                  placeholder="e.g. Lagos"
                  value={newLead.destinationCity}
                  onChange={(v) =>
                    setNewLead((p) => ({ ...p, destinationCity: v }))
                  }
                />
                <NewLeadField
                  label="Destination country"
                  placeholder="e.g. Nigeria"
                  value={newLead.destinationCountry}
                  onChange={(v) =>
                    setNewLead((p) => ({ ...p, destinationCountry: v }))
                  }
                />
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewLead(false);
                    resetNewLead();
                  }}
                  className="rounded-full px-3 py-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:text-corporate-black"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addNewLead}
                  disabled={!newLeadValid}
                  className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-cch-red-hover disabled:cursor-not-allowed disabled:bg-cch-red/40"
                >
                  <UserPlus className="size-3.5" />
                  Add &amp; select
                </button>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                Lead
              </span>
              <select
                value={selectedLeadId}
                onChange={(e) => {
                  const leadId = e.target.value;
                  setSelectedLeadId(leadId);
                  const lead = leads.find((item) => item.id === leadId);
                  const match = lead?.carCode
                    ? inventory.find((item) => item.carCode === lead.carCode)
                    : null;
                  setSelectedInventoryId(match?.id ?? "");
                  setInventoryBaseUsd(String(match?.priceUsdFob ?? ""));
                }}
                className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] text-corporate-black focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
              >
                <option value="">— Choose a lead —</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}
                    {lead.carCode ? ` · ${lead.carCode}` : ""}
                    {lead.destinationCity ? ` · ${lead.destinationCity}` : ""}
                  </option>
                ))}
              </select>
            </label>

            {selectedLead ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  Contact
                </span>
                <div className="rounded-md border border-hairline bg-surface-tint px-3 py-2 text-[12.5px] text-corporate-black">
                  <p className="font-medium">{selectedLead.name}</p>
                  <p className="mt-0.5 text-text-secondary">
                    {selectedLead.whatsapp} · {selectedLead.email}
                  </p>
                  {selectedLead.destinationCity ? (
                    <p className="mt-0.5 text-text-tertiary">
                      Destination: {selectedLead.destinationCity},{" "}
                      {selectedLead.destinationCountry ?? "—"}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {addedVehicles.length > 0 ? (
          <section className="overflow-hidden rounded-xl border border-hairline bg-white">
            <header className="border-b border-hairline px-5 py-3.5">
              <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
                Cars in this quote
              </h2>
              <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                {addedVehicles.length} saved {addedVehicles.length === 1 ? "car" : "cars"}. {finishedAddingCars ? "Your vehicle list is complete." : currentVehicleStarted ? "Complete the next car below." : "Add another car or finish the vehicle list."}
              </p>
            </header>
            <div className="divide-y divide-hairline">
              {addedVehicles.map((vehicle, index) => (
                <div key={`${vehicle.carName}-${index}`} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-corporate-black text-[11px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-corporate-black">{vehicle.carName}</p>
                    <p className="text-[11.5px] text-text-tertiary">{vehicle.carCode} · {formatUsd(vehicle.totalUsd)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => editSavedVehicle(vehicle, index)}
                    className="inline-flex size-8 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-corporate-black/5 hover:text-corporate-black"
                    aria-label={`Edit ${vehicle.carName}`}
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddedVehicles((vehicles) => vehicles.filter((_, i) => i !== index))}
                    className="inline-flex size-8 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-cch-red/10 hover:text-cch-red"
                    aria-label={`Remove ${vehicle.carName}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-hairline px-5 py-3">
              {finishedAddingCars ? (
                <button type="button" onClick={() => setFinishedAddingCars(false)} className="rounded-full border border-hairline px-3.5 py-1.5 text-[12px] font-medium text-text-secondary hover:bg-surface-tint">Add another car</button>
              ) : (
                <button type="button" onClick={() => setFinishedAddingCars(true)} className="inline-flex items-center gap-1.5 rounded-full bg-corporate-black px-4 py-2 text-[12px] font-semibold text-white hover:bg-corporate-black/90"><CheckCircle2 className="size-3.5" />Done adding cars</button>
              )}
            </div>
          </section>
        ) : null}

        {/* Vehicle */}
        <section className="overflow-hidden rounded-xl border border-hairline bg-white">
          <header className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
            <div>
              <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
                Vehicle
              </h2>
              <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                {mode === "matched"
                  ? "Pulled from inventory"
                  : "Entered manually (source-to-order)"}
              </p>
            </div>
            <div className="flex rounded-full bg-corporate-black/5 p-0.5 text-[11.5px] font-medium">
              <button
                type="button"
                onClick={() => setMode("matched")}
                disabled={inventory.length === 0}
                className={cn(
                  "rounded-full px-3 py-1 transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  mode === "matched"
                    ? "bg-white text-corporate-black shadow-[0_1px_0_rgba(15,23,42,0.06)]"
                    : "text-text-secondary hover:text-corporate-black",
                )}
              >
                Matched
              </button>
              <button
                type="button"
                onClick={() => setMode("manual")}
                className={cn(
                  "rounded-full px-3 py-1 transition-colors",
                  mode === "manual"
                    ? "bg-white text-corporate-black shadow-[0_1px_0_rgba(15,23,42,0.06)]"
                    : "text-text-secondary hover:text-corporate-black",
                )}
              >
                Manual
              </button>
            </div>
          </header>

          {mode === "matched" ? (
            <div className="px-5 py-4">
              <label className="mb-4 flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">Inventory vehicle</span>
                <select
                  value={activeInventory?.id ?? ""}
                  onChange={(event) => {
                    const id = event.target.value;
                    setSelectedInventoryId(id);
                    const selected = inventory.find((item) => item.id === id);
                    setInventoryBaseUsd(String(selected?.priceUsdFob ?? ""));
                  }}
                  className="h-10 rounded-md border border-hairline bg-white px-3 text-[13px] text-corporate-black focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                >
                  <option value="">— Choose a car from inventory —</option>
                  {inventory.map((item) => <option key={item.id} value={item.id}>{item.year} {item.brand} {item.model} · {item.carCode} · {formatUsd(item.priceUsdFob)}</option>)}
                </select>
              </label>
              {activeInventory ? <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-surface-warm">
                {activeInventory.heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeInventory.heroImageUrl}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-corporate-black">
                  {activeInventory.year} {activeInventory.brand}{" "}
                  {activeInventory.model}
                </p>
                <p className="mt-0.5 text-[12px] text-text-secondary">
                  <span className="font-medium text-corporate-black/75">
                    {activeInventory.carCode}
                  </span>
                  {" · "}
                  {activeInventory.condition === "new" ? "New" : "Used"}
                  {activeInventory.bodyType
                    ? ` · ${activeInventory.bodyType}`
                    : ""}
                </p>
                {activeInventory.batteryHealthPct ? (
                  <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                    Battery health {activeInventory.batteryHealthPct}%
                    {activeInventory.mileageKm
                      ? ` · ${activeInventory.mileageKm.toLocaleString()} km`
                      : ""}
                  </p>
                ) : null}
              </div>
              <label className="flex min-w-36 flex-col gap-1.5 text-left sm:text-right">
                <p className="text-[10.5px] font-medium uppercase tracking-wide text-text-tertiary">
                  {quoteKind === "pre_sales" ? "Booking Cost (USD)" : "FOB Guangzhou (USD)"}
                </p>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-tertiary">$</span>
                  <input
                    type="number"
                    min="0"
                    value={inventoryBaseUsd}
                    onChange={(event) => setInventoryBaseUsd(event.target.value)}
                    className="h-9 w-full rounded-md border border-hairline bg-white pl-7 pr-3 text-left text-[13px] tabular-nums focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15 sm:text-right"
                  />
                </div>
              </label>
              </div> : <p className="rounded-md bg-surface-tint px-3 py-3 text-[12px] text-text-secondary">Select an inventory vehicle above, or switch to Manual to quote a source-to-order car.</p>}
            </div>
          ) : null}

          {mode === "manual" ? (
            <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
              {selectedLead && !matchedInventory ? (
                <div className="md:col-span-2 inline-flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-[12px] text-amber-700">
                  <AlertTriangle className="size-3.5 shrink-0" />
                  <span>
                    No matching inventory for this lead — enter the car you
                    plan to source.
                  </span>
                </div>
              ) : null}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  Year
                </span>
                <input
                  type="number"
                  min="2015"
                  max="2030"
                  value={manualYear}
                  onChange={(e) => setManualYear(e.target.value)}
                  className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] tabular-nums focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  Condition
                </span>
                <select
                  value={manualCondition}
                  onChange={(e) =>
                    setManualCondition(e.target.value as "new" | "used")
                  }
                  className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  Brand
                </span>
                <input
                  type="text"
                  placeholder="e.g. BYD"
                  value={manualBrand}
                  onChange={(e) => setManualBrand(e.target.value)}
                  className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  Model
                </span>
                <input
                  type="text"
                  placeholder="e.g. Atto 3"
                  value={manualModel}
                  onChange={(e) => setManualModel(e.target.value)}
                  className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  {quoteKind === "pre_sales" ? "Booking cost (USD)" : "FOB Guangzhou price (USD)"}
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-tertiary">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="18900"
                    value={manualBaseUsd}
                    onChange={(e) => setManualBaseUsd(e.target.value)}
                    className="h-9 w-full rounded-md border border-hairline bg-white pl-7 pr-3 text-[13px] tabular-nums focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                  />
                </div>
              </label>
            </div>
          ) : null}
          <div className="grid gap-4 border-t border-hairline px-5 py-4 md:grid-cols-2">
            <NewLeadField label="Powertrain" placeholder="e.g. AWD electric" value={vehiclePowertrain} onChange={setVehiclePowertrain} />
            <NewLeadField label="VIN (if available)" placeholder="e.g. LSG…" value={vehicleVin} onChange={setVehicleVin} />
            <NewLeadField label="Exterior colour" placeholder="e.g. Pearl white" value={vehicleExteriorColor} onChange={setVehicleExteriorColor} />
            <NewLeadField label="Interior colour" placeholder="e.g. Black" value={vehicleInteriorColor} onChange={setVehicleInteriorColor} />
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">Quantity</span>
              <input type="number" min="1" max="100" value={vehicleQuantity} onChange={(event) => setVehicleQuantity(event.target.value)} className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] tabular-nums focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15" />
            </label>
          </div>
        </section>

        {/* Photos */}
        <section className="overflow-hidden rounded-xl border border-hairline bg-white">
          <header className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
            <div>
              <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
                Photos
              </h2>
              <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                Attach images for the quote. The first one is used as the
                vehicle photo on the PDF.
              </p>
            </div>
            <button
              type="button"
              onClick={() => attachmentInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3 py-1.5 text-[11.5px] font-medium text-text-secondary transition-colors hover:bg-surface-tint hover:text-corporate-black"
            >
              <ImagePlus className="size-3.5" />
              Upload images
            </button>
          </header>
          <input
            ref={attachmentInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                void addAttachments(e.target.files);
              }
              e.target.value = "";
            }}
          />
          <div className="px-5 py-4">
            {attachments.length === 0 ? (
              <button
                type="button"
                onClick={() => attachmentInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-hairline bg-surface-tint/40 px-4 py-8 text-center transition-colors hover:border-cch-red/40 hover:bg-surface-tint"
              >
                <ImagePlus className="size-6 text-text-tertiary" />
                <span className="text-[12.5px] font-medium text-corporate-black">
                  Click to upload images
                </span>
                <span className="text-[11px] text-text-tertiary">
                  JPG or PNG · multiple files supported
                </span>
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {attachments.map((att, index) => (
                  <div
                    key={att.id}
                    className="group relative aspect-[4/3] overflow-hidden rounded-md border border-hairline bg-surface-warm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={att.dataUrl}
                      alt={att.name}
                      className="absolute inset-0 size-full object-cover"
                    />
                    {index === 0 ? (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-corporate-black/75 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                        Cover
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      aria-label={`Remove ${att.name}`}
                      className="absolute right-1.5 top-1.5 inline-flex size-5 items-center justify-center rounded-full bg-corporate-black/70 text-white opacity-0 transition-opacity hover:bg-cch-red group-hover:opacity-100"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => attachmentInputRef.current?.click()}
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-hairline bg-surface-tint/40 text-text-tertiary transition-colors hover:border-cch-red/40 hover:text-corporate-black"
                >
                  <ImagePlus className="size-5" />
                  <span className="text-[10.5px] font-medium">Add more</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section className="overflow-hidden rounded-xl border border-hairline bg-white">
          <header className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
            <div>
              <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
                Pricing
              </h2>
              <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                Land it at the destination, all-in
              </p>
            </div>
            <span className="rounded-full bg-corporate-black/5 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-corporate-black/70">
              Step 3
            </span>
          </header>
          <div className="divide-y divide-hairline">
            {/* Base */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="text-[13px] font-medium text-corporate-black">
                  {quoteKind === "pre_sales" ? "Booking Cost" : "FOB Guangzhou"}
                </p>
                <p className="text-[11.5px] text-text-tertiary">
                  Base price of the vehicle
                </p>
              </div>
              <PriceInput
                value={mode === "matched" ? inventoryBaseUsd : manualBaseUsd}
                onChange={mode === "matched" ? setInventoryBaseUsd : setManualBaseUsd}
                placeholder="e.g. 18900"
                required
              />
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="text-[13px] font-medium text-corporate-black">
                  Ocean shipping
                </p>
                <p className="text-[11.5px] text-text-tertiary">
                  Quoted by the freight forwarder per car
                </p>
              </div>
              <PriceInput
                value={shippingUsd}
                onChange={setShippingUsd}
                placeholder="Optional"
              />
            </div>

            {/* Clearing */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="text-[13px] font-medium text-corporate-black">
                  Clearing & duties
                </p>
                <label className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] text-text-tertiary">
                  <input
                    type="checkbox"
                    checked={clearingTbc}
                    onChange={(e) => setClearingTbc(e.target.checked)}
                    className="size-3.5 rounded border-hairline text-cch-red focus:ring-cch-red/30"
                  />
                  Confirm at landing
                </label>
              </div>
              {clearingTbc ? (
                <span className="text-[12px] italic text-text-tertiary">
                  To be confirmed
                </span>
              ) : (
                <PriceInput
                  value={clearingUsd}
                  onChange={setClearingUsd}
                  placeholder="e.g. 1800"
                  required
                />
              )}
            </div>

            {/* Purchase tax */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="text-[13px] font-medium text-corporate-black">
                  Purchase tax
                </p>
                <p className="text-[11.5px] text-text-tertiary">
                  Vehicle purchase tax, when applicable
                </p>
              </div>
              <PriceInput
                value={purchaseTaxUsd}
                onChange={setPurchaseTaxUsd}
                placeholder="Optional"
              />
            </div>

            {/* Export licence */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="text-[13px] font-medium text-corporate-black">
                  Export licence
                </p>
                <p className="text-[11.5px] text-text-tertiary">
                  China export permit + paperwork
                </p>
              </div>
              <PriceInput
                value={exportLicenseUsd}
                onChange={setExportLicenseUsd}
                placeholder="e.g. 1500"
                required
              />
            </div>

            {/* Total */}
            <div className="flex items-center justify-between gap-4 bg-surface-tint px-5 py-4">
              <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                Total cost
              </p>
              <span className="font-display text-[28px] font-semibold leading-none tabular-nums text-corporate-black">
                {formatUsd(currentVehicleTotal)}
              </span>
            </div>
          </div>
          <div className="border-t border-hairline px-5 py-4">
            <button
              type="button"
              onClick={addAnotherVehicle}
              disabled={activeCar.basePriceUsd <= 0 || (!clearingTbc && clearingValue <= 0) || exportLicenseValue <= 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-corporate-black bg-white px-4 py-2.5 text-[13px] font-semibold text-corporate-black transition-colors hover:bg-surface-tint disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="size-4" />
              {editingVehicle ? "Save car changes" : "Save this car & add another"}
            </button>
          </div>
        </section>

        {/* Payment details */}
        <section className="overflow-hidden rounded-xl border border-hairline bg-white">
          <header className="border-b border-hairline px-5 py-3.5">
            <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
              Payment details
            </h2>
            <p className="mt-0.5 text-[11.5px] text-text-tertiary">
              {quoteKind === "pre_sales"
                ? "Set the booking payment account and amount due in the client's local currency."
                : "Choose the amount due and add the receiving account information."}
            </p>
          </header>
          <div className="grid gap-4 px-5 py-4">
            {quoteKind === "pre_sales" || paymentOption === "local_payment" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <NewLeadField label="Account number" required placeholder="Enter receiving account number" value={bookingAccountNumber} onChange={setBookingAccountNumber} />
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">Amount in local currency</span>
                  <div className="flex gap-2">
                    <input type="text" maxLength={3} value={bookingCurrency} onChange={(event) => setBookingCurrency(event.target.value.toUpperCase())} placeholder="NGN" className="h-10 w-20 rounded-md border border-hairline bg-white px-3 text-[13px] uppercase focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15" />
                    <input type="number" min="0" value={bookingAmountLocal} onChange={(event) => setBookingAmountLocal(event.target.value)} placeholder="e.g. 5000000" className="h-10 min-w-0 flex-1 rounded-md border border-hairline bg-white px-3 text-[13px] tabular-nums focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15" />
                  </div>
                </label>
              </div>
            ) : null}
            {quoteKind === "purchase" ? (
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  Payment option
                </span>
                <select
                  value={paymentOption}
                  onChange={(event) =>
                    setPaymentOption(event.target.value as QuotePaymentOption)
                  }
                  className="h-10 rounded-md border border-hairline bg-white px-3 text-[13px] text-corporate-black focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                >
                  <option value="full_payment">Full payment — {formatUsd(totalUsd)}</option>
                  <option value="deposit">Deposit (60%) — {formatUsd(totalUsd * 0.6)}</option>
                  <option value="local_payment">Local currency payment</option>
                </select>
              </label>
            ) : null}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                Account information
              </span>
              <textarea
                value={accountInformation}
                onChange={(event) => setAccountInformation(event.target.value)}
                rows={4}
                maxLength={600}
                placeholder={"Bank name\nAccount name\nAccount number\nSWIFT / routing information"}
                className="w-full rounded-md border border-hairline bg-white px-3 py-2 text-[13px] leading-relaxed text-corporate-black placeholder:text-text-tertiary focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
              />
            </label>
          </div>
        </section>

        {/* Purchase terms */}
        <section className="overflow-hidden rounded-xl border border-hairline bg-white">
          <header className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
            <div>
              <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
                Purchase Terms
              </h2>
              <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                Appears in the generated PDF (optional)
              </p>
            </div>
          </header>
          <div className="px-5 py-4">
            <textarea
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              rows={4}
              maxLength={400}
              placeholder="Enter payment timing, delivery conditions, validity, or other purchase terms…"
              className="w-full rounded-md border border-hairline bg-white px-3 py-2 text-[13px] leading-relaxed text-corporate-black placeholder:text-text-tertiary focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
            />
            <p className="mt-1 text-right text-[11px] text-text-tertiary tabular-nums">
              {personalNote.length}/400
            </p>
          </div>
        </section>

        {/* Spec source — attach a full manufacturer spec sheet to the PDF */}
        <section className="overflow-hidden rounded-xl border border-hairline bg-white">
          <header className="border-b border-hairline px-5 py-3.5">
            <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
              Spec source
            </h2>
            <p className="mt-0.5 text-[11.5px] text-text-tertiary">
              Optional. Paste a carnewschina.com /params URL to print the full
              manufacturer spec sheet in the quote PDF.
            </p>
          </header>
          <div className="space-y-3 px-5 py-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => {
                  setSourceUrl(e.target.value);
                  setSourceError(null);
                }}
                placeholder="https://data.carnewschina.com/database/…/params"
                className="h-11 w-full rounded-md border border-hairline bg-white px-3 text-[13px] text-corporate-black placeholder:text-text-tertiary focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
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

            {sourceError ? (
              <div
                role="alert"
                className="rounded-lg border border-cch-red px-3 py-2 text-[12.5px] text-cch-red"
              >
                {sourceError}
              </div>
            ) : null}

            {scrape ? (
              <div className="space-y-3">
                <div className="rounded-lg border border-hairline bg-surface-tint/60 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
                    Pulled from {new URL(scrape.sourceUrl).host}
                  </p>
                  <p className="mt-1 text-[13.5px] font-medium text-corporate-black">
                    {scrape.pageTitle}
                  </p>
                  <p className="mt-0.5 text-[12px] text-text-secondary">
                    {scrape.trims.length} trims ·{" "}
                    {Object.keys(scrape.specs).length} spec rows
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
                              name="quote-trim-pick"
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

                {quoteSpecs ? (
                  <p className="text-[12px] text-text-secondary">
                    {Object.keys(quoteSpecs).length} specs will be attached to
                    the quote PDF.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {/* ---------- RIGHT: live summary + actions ---------- */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <QuoteSummary
          lead={selectedLead}
          car={{ carCode: primaryVehicle.carCode, carName: primaryVehicle.carName, condition: primaryVehicle.carCondition, basePriceUsd: primaryVehicle.basePriceUsd, photo: primaryVehicle.photoUrls[0] ?? displayPhoto }}
          basePrice={primaryVehicle.basePriceUsd}
          shippingUsd={primaryVehicle.shippingUsd}
          clearingUsd={primaryVehicle.clearingUsd}
          purchaseTaxUsd={primaryVehicle.purchaseTaxUsd}
          exportLicenseUsd={primaryVehicle.serviceFeeUsd}
          totalUsd={totalUsd}
          validUntil={validUntilLabel}
          vehicles={quoteVehicles}
          basePriceLabel={quoteKind === "pre_sales" ? "Booking Cost" : "FOB Guangzhou"}
        />
        <div className="mt-3 space-y-2">
          <button
            type="button"
            disabled={!canGenerate || isGenerating}
            onClick={generatePdf}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cch-red px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.25)] transition-colors hover:bg-cch-red-hover disabled:cursor-not-allowed disabled:bg-cch-red/40 disabled:shadow-none"
          >
            <FileText className="size-4" />
            {isGenerating ? "Rendering…" : "Preview PDF"}
          </button>
          <button
            type="button"
            disabled={!canGenerate || isSending}
            onClick={emailQuote}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-white px-4 py-2.5 text-[13px] font-semibold text-corporate-black transition-colors hover:bg-surface-tint disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Mail className="size-4" />
            )}
            {isSending ? "Sending…" : "Generate & email PDF"}
          </button>
          <button
            type="button"
            disabled={!canGenerate || isGenerating}
            onClick={generatePdf}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-white px-4 py-2.5 text-[13px] font-semibold text-corporate-black transition-colors hover:bg-surface-tint disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="size-4" />
            Generate &amp; download PDF
          </button>
          <button
            type="button"
            disabled={!canGenerate || isSaving}
            onClick={saveDraft}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-medium text-text-secondary transition-colors hover:bg-surface-tint hover:text-corporate-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            {isSaving ? "Saving…" : "Save as draft"}
          </button>
        </div>
        {saveStatus?.kind === "ok" ? (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-emerald-50 px-3 py-2 text-[11.5px] text-emerald-700">
            <CheckCircle2 className="mt-px size-3.5 shrink-0" />
            <span>Draft saved successfully.</span>
          </div>
        ) : null}
        {saveStatus?.kind === "error" ? (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-cch-red/10 px-3 py-2 text-[11.5px] text-cch-red">
            <AlertTriangle className="mt-px size-3.5 shrink-0" />
            <span>{saveStatus.message}</span>
          </div>
        ) : null}
        {!canGenerate ? (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-[11.5px] text-amber-700">
            <FileText className="mt-px size-3.5 shrink-0" />
            <span>
              Missing: {missingFields.join(", ")}.
            </span>
          </div>
        ) : null}
        {pdfError ? (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-cch-red/10 px-3 py-2 text-[11.5px] text-cch-red">
            <AlertTriangle className="mt-px size-3.5 shrink-0" />
            <span>{pdfError}</span>
          </div>
        ) : null}
        {sendStatus?.kind === "ok" ? (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-emerald-50 px-3 py-2 text-[11.5px] text-emerald-700">
            <CheckCircle2 className="mt-px size-3.5 shrink-0" />
            <span>
              {sendStatus.mocked
                ? `Mock send to ${sendStatus.toEmail} (RESEND_API_KEY not set).`
                : `Quote emailed to ${sendStatus.toEmail}.`}
            </span>
          </div>
        ) : null}
        {sendStatus?.kind === "error" ? (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-cch-red/10 px-3 py-2 text-[11.5px] text-cch-red">
            <AlertTriangle className="mt-px size-3.5 shrink-0" />
            <span>{sendStatus.message}</span>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function NewLeadField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email";
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
        {label}
        {required ? <span className="text-cch-red"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] text-corporate-black placeholder:text-text-tertiary focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
      />
    </label>
  );
}

function PriceInput({
  value,
  onChange,
  placeholder,
  required = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const missing = required && (!value || Number(value) <= 0);
  return (
    <div className="relative w-32">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-tertiary">
        $
      </span>
      <input
        type="number"
        min="0"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-9 w-full rounded-md border bg-white pl-7 pr-3 text-right text-[13px] font-medium tabular-nums placeholder:text-text-tertiary placeholder:font-normal focus:outline-none focus:ring-2",
          missing
            ? "border-cch-red/30 focus:border-cch-red focus:ring-cch-red/15"
            : "border-hairline focus:border-cch-red focus:ring-cch-red/15",
        )}
      />
    </div>
  );
}
