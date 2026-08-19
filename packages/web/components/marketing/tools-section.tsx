import { HugeiconsIcon } from "@hugeicons/react";
import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";
import { TOOLS, type Tool } from "@/lib/data/tools";

function ToolGroup({ label, tools }: { label: string; tools: Tool[] }) {
  return (
    <div>
      <h3 className="font-mono text-xs tracking-wide text-muted-foreground">
        {label}
      </h3>
      <div className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2">
        {tools.map((tool) => (
          <div key={tool.name} className="flex flex-col gap-2 bg-card p-5">
            <HugeiconsIcon
              icon={tool.icon}
              size={18}
              strokeWidth={1.5}
              className="text-primary"
            />
            <span className="font-mono text-sm text-foreground">{tool.name}</span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ToolsSection() {
  const readTools = TOOLS.filter((tool) => tool.planSafe);
  const writeTools = TOOLS.filter((tool) => !tool.planSafe);

  return (
    <section id="tools" className="border-t border-border py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            title="Seven tools, sandboxed to your project."
            description="Every path resolves inside the project root. Writes and shell commands wait for your approval before they run."
          />
        </Reveal>

        <div className="mt-10 space-y-10">
          <Reveal delay={0.05}>
            <ToolGroup label="Read & search" tools={readTools} />
          </Reveal>
          <Reveal delay={0.1}>
            <ToolGroup label="Write & execute" tools={writeTools} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
