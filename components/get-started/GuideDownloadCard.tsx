"use client";

import { ArrowRight, BookOpen, Check, Download, Loader2 } from "lucide-react";
import { useState } from "react";

import { requestGuideDownload } from "@/app/get-started/actions";
import {
  GUIDE_DOWNLOAD_NAME,
  GUIDE_FILE,
  GUIDE_TITLE,
  guideDownloadSchema,
} from "@/app/get-started/schema";

type Stage = "closed" | "form" | "ready";

export function GuideDownloadCard() {
  const [stage, setStage] = useState<Stage>("closed");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setFieldErrors({});

    // Both fields are required. Check here against the same schema the action
    // uses, so an empty or malformed entry is caught without a round trip.
    const parsed = guideDownloadSchema.safeParse({ firstName, email });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in errors)) {
          errors[key] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const result = await requestGuideDownload({ firstName, email });
      if (result.ok) {
        setStage("ready");
      } else {
        setError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
      }
    } catch (err) {
      console.error("[get-started] guide request failed", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (invalid: boolean) =>
    "h-11 w-full rounded-xl border bg-white px-4 text-[14px] text-corporate-black placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-cch-red/15 " +
    (invalid
      ? "border-cch-red focus:border-cch-red"
      : "border-hairline focus:border-cch-red");

  return (
    <div className="overflow-hidden rounded-2xl border border-corporate-black/10 bg-corporate-black shadow-[0_10px_28px_rgba(15,23,42,0.16)]">
      <div className="px-5 py-4">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white">
            <BookOpen className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center rounded-full bg-cch-red px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white">
              Free guide
            </span>
            <p className="mt-2 text-[15px] font-semibold leading-tight text-white">
              {GUIDE_TITLE}
            </p>
            <p className="mt-1 text-[12.5px] leading-snug text-white/70">
              Buying new and used vehicles from China safely — sourcing,
              verification, documentation, shipping and delivery.
            </p>
          </div>
        </div>

        {stage === "closed" ? (
          <button
            type="button"
            onClick={() => setStage("form")}
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-[14px] font-semibold text-corporate-black transition-colors hover:bg-white/90"
          >
            Get the free guide
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        ) : null}

        {stage === "form" ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-2.5" noValidate>
            <div>
              <label htmlFor="guide-first-name" className="sr-only">
                First name
              </label>
              <input
                id="guide-first-name"
                autoFocus
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First name *"
                autoComplete="given-name"
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.firstName)}
                className={inputClass(Boolean(fieldErrors.firstName))}
              />
              {fieldErrors.firstName ? (
                <p className="mt-1 text-[11.5px] text-cch-red">
                  {fieldErrors.firstName}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="guide-email" className="sr-only">
                Email address
              </label>
              <input
                id="guide-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address *"
                autoComplete="email"
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.email)}
                className={inputClass(Boolean(fieldErrors.email))}
              />
              {fieldErrors.email ? (
                <p className="mt-1 text-[11.5px] text-cch-red">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={submitting || !firstName.trim() || !email.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cch-red px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-cch-red-hover disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Just a moment…
                </>
              ) : (
                <>
                  Download
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </button>

            {error ? (
              <p className="text-[11.5px] text-cch-red">{error}</p>
            ) : null}

            <p className="text-center text-[10.5px] leading-snug text-white/50">
              We&rsquo;ll only use this to send you the guide and occasional
              vehicle updates. Unsubscribe anytime.
            </p>
          </form>
        ) : null}

        {stage === "ready" ? (
          <div className="mt-4 space-y-2.5">
            <p className="flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-white">
              <Check className="size-4 text-[#25D366]" aria-hidden="true" />
              Thanks{firstName.trim() ? `, ${firstName.trim()}` : ""} — your
              guide is ready.
            </p>
            <a
              href={GUIDE_FILE}
              download={GUIDE_DOWNLOAD_NAME}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-[14px] font-semibold text-corporate-black transition-colors hover:bg-white/90"
            >
              <Download
                className="size-4 transition-transform group-hover:translate-y-0.5"
                aria-hidden="true"
              />
              Download the guide (PDF)
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
