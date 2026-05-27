import type { SVGProps } from "react";

const WHATSAPP_LINK = "https://wa.me/8619802019509";

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.003 0C7.171 0 .003 7.168.003 16c0 2.823.736 5.581 2.139 8.008L0 32l8.211-2.143a15.962 15.962 0 0 0 7.792 1.945h.006c8.83 0 15.998-7.168 16-15.999 0-4.276-1.661-8.297-4.685-11.32C24.301 1.661 20.28 0 16.003 0zm0 29.155h-.005a13.114 13.114 0 0 1-6.685-1.83l-.479-.285-4.971 1.302 1.327-4.847-.312-.497a13.058 13.058 0 0 1-2.005-6.998c0-7.224 5.876-13.1 13.103-13.1 3.498 0 6.788 1.363 9.262 3.842a13.011 13.011 0 0 1 3.835 9.27c-.003 7.225-5.879 13.143-13.07 13.143zm7.188-9.812c-.394-.197-2.33-1.149-2.69-1.281-.361-.132-.624-.197-.886.197-.262.394-1.017 1.281-1.247 1.544-.23.263-.459.296-.853.099-.394-.197-1.663-.613-3.168-1.955-1.171-1.044-1.962-2.334-2.192-2.728-.23-.394-.025-.607.172-.803.176-.176.394-.459.591-.689.197-.23.262-.394.394-.657.131-.262.066-.492-.033-.689-.099-.197-.886-2.137-1.214-2.926-.32-.767-.644-.663-.886-.676-.23-.012-.492-.014-.755-.014a1.456 1.456 0 0 0-1.054.492c-.361.394-1.378 1.346-1.378 3.283 0 1.937 1.41 3.808 1.607 4.072.197.263 2.777 4.242 6.728 5.948.94.406 1.674.648 2.246.829.943.3 1.802.258 2.481.156.757-.113 2.33-.953 2.659-1.873.328-.92.328-1.708.23-1.873-.099-.165-.361-.262-.755-.459z" />
    </svg>
  );
}

export function CarentoWhatsAppCta() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-content px-6">
        <div className="relative overflow-hidden rounded-[20px] bg-[#0a3b2e] px-8 py-10 shadow-card md:px-12 md:py-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(37,211,102,0.25),transparent_55%)]"
          />
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="flex items-start gap-5">
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)]">
                <WhatsAppIcon className="size-7" />
              </span>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#25D366]">
                  Prefer WhatsApp?
                </p>
                <h3 className="mt-2 font-display text-[26px] font-bold leading-[1.15] text-white md:text-[32px]">
                  Message us now — we reply within an hour.
                </h3>
              </div>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-[13.5px] font-semibold text-white shadow-[0_12px_28px_rgba(37,211,102,0.35)] transition-colors hover:bg-[#1fb955]"
            >
              <WhatsAppIcon className="size-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
