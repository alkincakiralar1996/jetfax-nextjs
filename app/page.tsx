import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { HowItWorks } from "@/components/HowItWorks";
import { UseCases } from "@/components/UseCases";
import { Versus } from "@/components/Versus";
import { Trust } from "@/components/Trust";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-[#FAFAF7] text-[#0A0A0A]">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <UseCases />
      <Versus />
      <Trust />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
