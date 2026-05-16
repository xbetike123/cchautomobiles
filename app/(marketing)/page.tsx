import { Brands } from "@/components/home/Brands";
import { Hero } from "@/components/home/Hero";
import { MarketIntel } from "@/components/home/MarketIntel";
import { OnTheLot } from "@/components/home/OnTheLot";
import { ProcessDiagram } from "@/components/home/ProcessDiagram";
import { Team } from "@/components/home/Team";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustBar } from "@/components/home/TrustBar";
import { WalkTheLot } from "@/components/home/WalkTheLot";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ProcessDiagram />
      <OnTheLot />
      <WalkTheLot />
      <Brands />
      <Testimonials />
      <Team />
      <MarketIntel />
    </>
  );
}
