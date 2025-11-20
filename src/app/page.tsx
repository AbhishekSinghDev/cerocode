import { CodeExamples } from "@/components/landing-page/code-examples";
import { CTABanner } from "@/components/landing-page/cta-banner";
import { FAQ } from "@/components/landing-page/faq";
import { Features } from "@/components/landing-page/features";
import { Footer } from "@/components/landing-page/footer";
import { Hero } from "@/components/landing-page/hero";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { Navbar } from "@/components/landing-page/navbar";
import { Pricing } from "@/components/landing-page/pricing";
import { Testimonials } from "@/components/landing-page/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CodeExamples />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
