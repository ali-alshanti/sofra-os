import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { HeroSection } from "@/features/landing/components/hero-section";
import { StatsSection } from "@/features/landing/components/stats-section";
import { FeaturesGrid } from "@/features/landing/components/features-grid";
import { DashboardPreview } from "@/features/landing/components/dashboard-preview";
import { WorkflowSection } from "@/features/landing/components/workflow-section";
import { WhySofraSection } from "@/features/landing/components/why-sofra-section";
import { GallerySection } from "@/features/landing/components/gallery-section";
import { PricingSection } from "@/features/landing/components/pricing-section";
import { FaqSection } from "@/features/landing/components/faq-section";
import { FinalCtaSection } from "@/features/landing/components/final-cta-section";
import { LandingFooter } from "@/features/landing/components/landing-footer";

interface LandingPageProps {
  isAuthenticated?: boolean;
}

export function LandingPage({ isAuthenticated = false }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <LandingNavbar isAuthenticated={isAuthenticated} />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesGrid />
        <DashboardPreview />
        <WorkflowSection />
        <WhySofraSection />
        <GallerySection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
