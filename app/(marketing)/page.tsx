import { Brands } from "@/components/home/Brands";
import { Hero } from "@/components/home/Hero";
import { NewVsUsed } from "@/components/home/NewVsUsed";
import { OnTheLot } from "@/components/home/OnTheLot";
import { ProcessDiagram } from "@/components/home/ProcessDiagram";
import { TrustBar } from "@/components/home/TrustBar";
import { WalkTheLot } from "@/components/home/WalkTheLot";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <NewVsUsed />
      <ProcessDiagram />
      <OnTheLot />
      <WalkTheLot />
      <Brands />
    </>
  );
}
