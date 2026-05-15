import { Hero } from "@/components/home/Hero";
import { NewVsUsed } from "@/components/home/NewVsUsed";
import { ProcessDiagram } from "@/components/home/ProcessDiagram";
import { TrustBar } from "@/components/home/TrustBar";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <NewVsUsed />
      <ProcessDiagram />
    </>
  );
}
