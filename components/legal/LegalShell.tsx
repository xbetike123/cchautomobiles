import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro?: string;
  children: ReactNode;
};

export function LegalShell({
  eyebrow,
  title,
  lastUpdated,
  intro,
  children,
}: Props) {
  return (
    <article className="bg-white">
      <header className="border-b border-hairline bg-surface-tint">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <p className="text-meta text-cch-red">{eyebrow}</p>
          <h1 className="mt-4 font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[48px]">
            {title}
          </h1>
          <p className="mt-4 text-[13px] uppercase tracking-[0.12em] text-text-tertiary">
            Last updated · {lastUpdated}
          </p>
          {intro ? (
            <p className="mt-6 max-w-[640px] text-[15px] leading-[1.7] text-text-secondary">
              {intro}
            </p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div
          className={
            "space-y-12 " +
            "[&_h2]:font-display [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:text-corporate-black " +
            "[&_h3]:font-display [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:tracking-[-0.005em] [&_h3]:text-corporate-black [&_h3]:mt-6 " +
            "[&_p]:text-[15px] [&_p]:leading-[1.75] [&_p]:text-text-secondary [&_p]:mt-3 " +
            "[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-[15px] [&_ul]:leading-[1.75] [&_ul]:text-text-secondary [&_li]:mt-1.5 " +
            "[&_a]:text-corporate-black [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-cch-red"
          }
        >
          {children}
        </div>

        <p className="mt-16 rounded-card border border-hairline bg-surface-tint px-6 py-5 text-[13px] leading-[1.6] text-text-secondary">
          This page is a working draft. The final wording is pending legal
          review. For any questions in the meantime, reach the CCH Automobile
          team at{" "}
          <a
            href="mailto:hello@chinesecarshub.com"
            className="font-medium text-corporate-black underline underline-offset-2 hover:text-cch-red"
          >
            hello@chinesecarshub.com
          </a>
          .
        </p>
      </div>
    </article>
  );
}
