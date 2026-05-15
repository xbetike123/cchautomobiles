import Link from "next/link";

const WHATSAPP_PLACEHOLDER_URL = "https://wa.me/0000000000";
const PHONE_PLACEHOLDER = "+86 · placeholder";

export function UtilityBar() {
  return (
    <div className="bg-corporate-black text-white">
      <div className="mx-auto flex h-9 max-w-content items-center justify-between px-6 text-[12px] leading-none">
        <p className="font-medium tracking-[0.01em]">
          Guangzhou to Lagos · Weekly shipments.
        </p>
        <div className="flex items-center gap-6 text-white/85">
          <span aria-label="CCH operations phone number">{PHONE_PLACEHOLDER}</span>
          <span aria-hidden="true" className="h-3 w-px bg-white/20" />
          <nav aria-label="Language" className="flex items-center gap-2">
            <span className="font-medium text-white">EN</span>
            <span aria-hidden="true" className="text-white/30">
              ·
            </span>
            <span className="text-white/50">FR soon</span>
          </nav>
          <span aria-hidden="true" className="h-3 w-px bg-white/20" />
          <Link
            href={WHATSAPP_PLACEHOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white hover:text-cch-red"
          >
            WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
}
