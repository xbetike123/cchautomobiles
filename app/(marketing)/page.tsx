import { Hero } from "@/components/home/Hero";
import { NewVsUsed } from "@/components/home/NewVsUsed";
import { TrustBar } from "@/components/home/TrustBar";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <NewVsUsed />
    </>
  );
}
