import Image from "next/image";

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

export function PartnersBar() {
  return (
    <section
      aria-label="Brands sourced"
      className="-mt-12 bg-white md:-mt-16"
    >
      <div className="mx-auto max-w-content px-6">
        <div className="relative z-10 rounded-[10px] border border-hairline bg-surface-tint/50 px-6 py-7 md:px-10 md:py-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
              We stock clean cars from
            </p>
            <p className="font-display text-[16px] font-semibold leading-[1.2] tracking-[-0.01em] text-corporate-black md:text-[18px]">
              The leading Chinese EV brands.
            </p>
          </div>

          <ul className="mt-7 grid grid-cols-4 items-center gap-x-4 gap-y-5 sm:grid-cols-6 md:mt-8 md:grid-cols-8 lg:grid-cols-12">
            {brandLogos.map((file) => (
              <li
                key={file}
                className="group flex items-center justify-center"
              >
                <Image
                  src={`/brands/${file}`}
                  alt=""
                  width={56}
                  height={56}
                  className="h-10 w-auto object-contain opacity-65 transition-opacity duration-200 group-hover:opacity-100 md:h-11"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
