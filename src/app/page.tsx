import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DataScope — Enterprise Data Discovery & Intelligence Platform",
  description:
    "Explore millions of business records through powerful search, intelligent filtering, and high-performance data exploration. Built for enterprise scale.",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
      </main>
    </div>
  );
}
