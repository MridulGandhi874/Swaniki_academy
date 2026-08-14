import Hero from "@/components/landing/Hero";
import DummyProjectCTA from "@/components/landing/DummyProjectCTA";
import FeatureGrid from "@/components/landing/FeatureGrid";
import StatsBanner from "@/components/landing/StatsBanner";
import ValuePropTabs from "@/components/landing/ValuePropTabs";
import Testimonials from "@/components/landing/Testimonials";
import FAQAccordion from "@/components/landing/FAQAccordion";
import CTABanner from "@/components/landing/CTABanner";

export default function Home() {
  return (
    <>
      <Hero />
      <DummyProjectCTA />
      <FeatureGrid />
      <StatsBanner />
      <ValuePropTabs />
      <Testimonials />
      <FAQAccordion />
      <CTABanner />
    </>
  );
}
