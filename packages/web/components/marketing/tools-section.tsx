import { HugeiconsIcon } from "@hugeicons/react";
import {
  File01Icon,
  FolderIcon,
  FolderSearchIcon,
  Search01Icon,
  FileEditIcon,
  PencilEdit02Icon,
  TerminalIcon,
} from "@hugeicons/core-free-icons";
import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";

type ToolCard = {
  icon: typeof File01Icon;
  name: string;
  description: string;
};

const READ_TOOLS: ToolCard[] = [
  { icon: File01Icon, name: "readFile", description: "Reads a file's contents, truncated past 10,000 characters." },
  { icon: FolderIcon, name: "listDirectory", description: "Lists files and folders inside the current project." },
  { icon: FolderSearchIcon, name: "glob", description: "Finds files by pattern, capped at 200 results." },
  { icon: Search01Icon, name: "grep", description: "Searches file contents for a pattern, up to 50 matches." },
];

const WRITE_TOOLS: ToolCard[] = [
  { icon: FileEditIcon, name: "writeFile", description: "Creates or overwrites a file. Waits for your approval first." },
  { icon: PencilEdit02Icon, name: "editFile", description: "Applies a targeted diff to an existing file. Also gated." },
  { icon: TerminalIcon, name: "bash", description: "Runs a shell command in the project directory, 30s timeout." },
];

function ToolGroup({ label, tools }: { label: string; tools: ToolCard[] }) {
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
            <ToolGroup label="Read & search" tools={READ_TOOLS} />
          </Reveal>
          <Reveal delay={0.1}>
            <ToolGroup label="Write & execute" tools={WRITE_TOOLS} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
