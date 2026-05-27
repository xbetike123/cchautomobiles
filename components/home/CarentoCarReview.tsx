import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";

const FEATURED = {
  title: "Farewell, BMW M2: will this be the last M car of its kind",
  date: "18 August 2024",
  image: "/about/pexels-silverkblack-36729874.jpg",
};

const SIDEBAR = [
  {
    title: "Best Midsize 3-row SUVs 2024",
    date: "18 August 2024",
    image: "/about/pexels-ai25studioai-7144184.jpg",
  },
  {
    title: "5 Best Luxury sport coupes 2024",
    date: "18 August 2024",
    image: "/about/pexels-gustavo-fring-4895435.jpg",
  },
  {
    title: "Best Small hatchbacks 2024 and 2025",
    date: "18 August 2024",
    image: "/about/pexels-zion-5948346.jpg",
  },
];

export function CarentoCarReview() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-[36px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[44px]">
              Car Review
            </h2>
            <p className="mt-2 text-[14px] text-text-secondary">
              Expert insights and honest evaluations to help you choose the
              perfect car
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-cch-red px-6 py-3 text-[13px] font-semibold text-white hover:bg-cch-red-hover"
          >
            View More
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <article className="group relative overflow-hidden rounded-[20px] border border-hairline bg-white shadow-card">
            <div className="relative aspect-[16/11] w-full">
              <Image
                src={FEATURED.image}
                alt={FEATURED.title}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,0.65)_100%)]" />
              <button
                type="button"
                aria-label="Play"
                className="absolute left-1/2 top-1/2 inline-flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cch-red text-white shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-transform hover:scale-110"
              >
                <Play className="size-6 translate-x-[1px]" fill="currentColor" aria-hidden="true" />
              </button>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <h3 className="font-display text-[22px] font-semibold leading-[1.25] md:text-[26px]">
                  {FEATURED.title}
                </h3>
                <p className="mt-2 text-[12.5px] text-white/80">
                  {FEATURED.date}
                </p>
              </div>
            </div>
          </article>

          <div className="rounded-[20px] bg-cch-red-soft p-5 md:p-6">
            <ul className="flex flex-col gap-4">
              {SIDEBAR.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center gap-4 rounded-[12px] p-1 transition-colors hover:bg-white/60"
                >
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-[12px] bg-corporate-black/10">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex size-9 items-center justify-center rounded-full bg-cch-red text-white">
                        <Play
                          className="size-4 translate-x-[1px]"
                          fill="currentColor"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[15px] font-semibold leading-tight text-corporate-black">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-[11.5px] text-text-secondary">
                      {item.date}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
