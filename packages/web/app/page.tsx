import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { DemoSection } from "@/components/marketing/demo-section";
import { ModelsSection } from "@/components/marketing/models-section";
import { ModesSection } from "@/components/marketing/modes-section";
import { ToolsSection } from "@/components/marketing/tools-section";
import { ArchitectureSection } from "@/components/marketing/architecture-section";
import { CommandsSection } from "@/components/marketing/commands-section";
import { InstallSection } from "@/components/marketing/install-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1">
        <Hero />
        <DemoSection />
        <ModelsSection />
        <ModesSection />
        <ToolsSection />
        <ArchitectureSection />
        <CommandsSection />
        <InstallSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
