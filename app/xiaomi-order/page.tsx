import type { Metadata } from "next";

import { XiaomiConfigurator } from "@/components/xiaomi/XiaomiConfigurator";

export const metadata: Metadata = {
  title: "Xiaomi YU7 Order · Build & Price · CCH Automobile",
  description:
    "Configure a Xiaomi YU7 — choose the EV, PRO or MAX, exterior colour, interior, wheels and options, and get a live FOB Nansha price you can send straight to CCH on WhatsApp.",
};

export default function XiaomiOrderPage() {
  return <XiaomiConfigurator />;
}
