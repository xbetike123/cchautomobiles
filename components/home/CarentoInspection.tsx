import {
  BatteryCharging,
  FileCheck,
  Plug,
  ShieldCheck,
  Video,
  Wrench,
} from "lucide-react";

const CHECKS = [
  {
    Icon: Wrench,
    title: "Mechanical Inspection",
    description:
      "Brakes, suspension, steering, drivetrain, lights, and core systems checked before approval.",
  },
  {
    Icon: BatteryCharging,
    title: "Battery Health Report",
    description:
      "Battery condition, charging performance, and estimated range verified and documented.",
  },
  {
    Icon: Video,
    title: "Full Walkaround Video",
    description:
      "Exterior, interior, startup, and underbody videos sent directly to your WhatsApp.",
  },
  {
    Icon: ShieldCheck,
    title: "Accident & Frame Verification",
    description:
      "VIN history and physical frame inspection carried out to detect hidden accident damage.",
  },
  {
    Icon: Plug,
    title: "Charging Compatibility Check",
    description:
      "Verified to match the charging standards used in your destination country.",
  },
  {
    Icon: FileCheck,
    title: "Export Documentation",
    description:
      "VIN verification, export paperwork, and shipping documents prepared before dispatch.",
  },
];

export function CarentoInspection() {
  return (
    <section className="bg-surface-tint py-20 md:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cch-red">
            Pre-Shipment Inspection
          </span>
          <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[48px]">
            What We Check Before
            <br />
            Your EV Ships
          </h2>
          <p className="mt-5 max-w-[560px] text-[14.5px] leading-[1.65] text-text-secondary">
            Every vehicle is physically inspected on our Guangzhou lot before
            shipment. You receive detailed videos, diagnostics, and verification
            before final payment.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {CHECKS.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-[18px] border border-hairline bg-white p-6 shadow-card"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-cch-red-soft text-cch-red">
                <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3 className="text-[16px] font-semibold text-corporate-black">
                {title}
              </h3>
              <p className="text-[13.5px] leading-[1.6] text-text-secondary">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
