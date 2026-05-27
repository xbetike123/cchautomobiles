import Image from "next/image";

import { SectionMarker } from "@/components/site/SectionMarker";

const brandLogos = [
  "200x200_c40_autohomecar__Chtk2GhRI9CAFZpkAABgLw1ilAg017.png",
  "200x200_c40_autohomecar__Chtk3WhRKAiAA0jhAAF75YXGKyk748.png",
  "200x200_c40_autohomecar__ChtliGhRJhKAM8ccAAAudcnnaog026.png",
  "200x200_c40_autohomecar__ChxkPWhPvOmAHljRAACWIRmwjmo387.png",
  "200x200_c40_autohomecar__ChxkPmhPviKAEdZIAADsFXqwduc853.png",
  "200x200_c40_autohomecar__ChxkPmhRJ8iAWyitAAEMOjoyJSw506.png",
  "200x200_c40_autohomecar__ChxkPmhRJUCARr5bAAAILp-rU3Y497.png",
  "200x200_c40_autohomecar__ChxkPmhRJzmAYz61AADWg7A1mVc868.png",
  "200x200_c40_autohomecar__ChxkjmhPjHKARPUIAABCEED0WrE099.png",
  "200x200_c40_autohomecar__ChxkjmhRJKCAeJvfAAArVpC7oAo719.png",
  "200x200_c40_autohomecar__ChxkjmhRJxeADRQWAAAvV6fWOLk858.png",
  "200x200_c40_autohomecar__ChxkmWhRJ32AawgTAAAvzyKAfEE965.png",
  "200x200_c40_autohomecar__ChxknGhRJ52AF7RDAAJbYp3idOY197.png",
  "200x200_c40_autohomecar__ChxkqWhPh4yAUweOAAAxdueyXmY406.png",
  "200x200_c40_autohomecar__ChxoHWhRJ-mAYUwXAACPNvW7NiQ263.png",
  "200x200_c40_autohomecar__ChxoHWhxzBiAdvfiAAArtdLoX4s224.png",
  "200x200_c40_autohomecar__ChxoHmhRJZKADYA0AAAv5XkAc54775.png",
  "200x200_c40_autohomecar__CjIFU2hPvUOAYRYEAAA1kGyk_SA168.png",
  "200x200_c40_autohomecar__CjIFU2hRJuuAIogtAAAxwLHYjho898.png",
  "200x200_c40_autohomecar__CjIFU2hRKCqAETz1AABpRGnHxjI882.png",
  "200x200_c40_autohomecar__CjIFVGhPvoaAe0jSAACbpcOfAic253.png",
  "200x200_c40_autohomecar__CjIFVmhPjAiAU2mBAABHk5jhl2k105.png",
  "200x200_c40_autohomecar__CjIFVmhRJ1mACcTJAAARSRcv0as419.png",
  "200x200_c40_autohomecar__CjIFVmhRJb-ATNicAABvucEE9U8648.png",
];

const rows = [
  brandLogos.slice(0, 6),
  brandLogos.slice(6, 12),
  brandLogos.slice(12, 18),
  brandLogos.slice(18, 24),
];

export function BrandStrip() {
  return (
    <section className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-content px-6 pt-20 pb-20 md:pt-24 md:pb-24">
        <SectionMarker number="02" label="Brands" className="mb-10" />
        <p className="text-center text-[12px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
          From the brand you want.
        </p>

        <div className="mt-8 flex flex-col gap-10 md:mt-10 md:gap-0">
          {rows.map((row, rowIdx) => (
            <ul
              key={rowIdx}
              className="grid grid-cols-3 sm:grid-cols-6 md:divide-x md:divide-hairline md:[&>li]:py-8 md:[&+ul]:border-t md:[&+ul]:border-hairline"
            >
              {row.map((file) => (
                <li
                  key={file}
                  className="group flex items-center justify-center px-4 py-3 md:px-8"
                >
                  <Image
                    src={`/brands/${file}`}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-auto object-contain opacity-80 transition-opacity duration-200 group-hover:opacity-100"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
