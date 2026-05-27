import Link from "next/link";

import { SectionHeader } from "@/components/site/SectionHeader";
import { TertiaryLink } from "@/components/site/TertiaryLink";
import { getHomeMarketIntel } from "@/lib/queries/marketIntel";
import type { MarketIntelRow } from "@/lib/queries/marketIntel";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatMeta(post: MarketIntelRow): string {
  const parts: string[] = [];
  if (post.published_at) {
    parts.push(dateFormatter.format(new Date(post.published_at)).toUpperCase());
  }
  if (post.read_time_minutes != null) {
    parts.push(`${post.read_time_minutes} min read`.toUpperCase());
  }
  return parts.join(" · ");
}

export async function MarketIntel() {
  const posts = await getHomeMarketIntel();
  if (posts.length === 0) return null;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-content px-6 py-12 md:py-24">
        <SectionHeader
          label="Market intel"
          heading="Notes from Guangzhou."
          align="left"
          aside={<TertiaryLink href="/intel">Read all articles</TertiaryLink>}
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-hairline border-t border-hairline">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-4 py-8 first:pl-0 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <p className="text-meta">
                <span className="text-cch-red">{formatMeta(post)}</span>
              </p>
              <Link
                href={`/intel/${post.slug}`}
                className="font-display text-[18px] font-medium leading-[1.3] tracking-[-0.01em] text-corporate-black hover:text-cch-red"
              >
                {post.title}
              </Link>
              {post.preview ? (
                <p className="line-clamp-1 text-[13px] leading-[1.5] text-text-secondary">
                  {post.preview}
                </p>
              ) : null}
              <div className="mt-auto pt-2">
                <TertiaryLink href={`/intel/${post.slug}`}>
                  Read article
                </TertiaryLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
