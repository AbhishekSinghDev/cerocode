import { CTABanner } from "@/components/landing-page/cta-banner";
import { FAQ } from "@/components/landing-page/faq";
import { Features } from "@/components/landing-page/features";
import { Footer } from "@/components/landing-page/footer";
import { Hero } from "@/components/landing-page/hero";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { Navbar } from "@/components/landing-page/navbar";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
