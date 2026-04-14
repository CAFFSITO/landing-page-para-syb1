import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import ProblemSection from "@/components/landing/problem-section";
import MethodologySection from "@/components/landing/methodology-section";
import PillarsSection from "@/components/landing/pillars-section";
import GuaranteeSection from "@/components/landing/guarantee-section";
import CtaFinal from "@/components/landing/cta-final";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <MethodologySection />
        <PillarsSection />
        <GuaranteeSection />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
