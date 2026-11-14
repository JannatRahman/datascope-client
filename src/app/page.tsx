import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ShowcaseSection from "@/components/landing/ShowcaseSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import SecuritySection from "@/components/landing/SecuritySection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DataScope — Enterprise Data Discovery & Intelligence Platform",
  description:
    "Explore millions of business records through powerful search, intelligent filtering, and high-performance data exploration. Built for enterprise scale.",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ShowcaseSection />
        <HowItWorksSection />
        <SecuritySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
