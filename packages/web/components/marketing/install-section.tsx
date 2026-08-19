"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";
import { INSTALL_COMMAND } from "@/lib/constants";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { TOOLS, type Tool } from "@/lib/data/tools";
import { DIFF, SETUP_LINES } from "@/lib/data/install";

const TOOL_CALLS: (Tool & { target: string })[] = [
  {
    ...TOOLS.find((tool) => tool.id === "readFile")!,
    target: "README.md",
  },
  {
    ...TOOLS.find((tool) => tool.id === "editFile")!,
    target: "README.md",
  },
];

export function InstallSection() {
  const { copied, copy } = useCopyToClipboard(INSTALL_COMMAND);

  return (
    <section id="install" className="border-t border-border py-20 sm:py-28">
      <Container className="max-w-3xl">
        <Reveal>
          <SectionHeading
            align="center"
            title="Running in under a minute."
            description="No configuration is required. Production endpoints are baked in."
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="font-mono text-[11px] text-muted-foreground">
                quickstart
              </span>
              <button
                type="button"
                onClick={copy}
                className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <HugeiconsIcon
                  icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
                  size={13}
                  strokeWidth={1.5}
                  className={copied ? "text-success" : undefined}
                />
                {copied ? "copied" : "copy install"}
              </button>
            </div>

            <div className="space-y-2.5 px-5 py-6 font-mono text-sm">
              {SETUP_LINES.map((line) => (
                <div
                  key={line.text}
                  className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3"
                >
                  <div>
                    <span className="text-terminal-blue">{line.prompt}</span>{" "}
                    <span className="text-foreground">{line.text}</span>
                  </div>
                  <span className="text-xs text-muted-foreground sm:ml-2">
                    {line.note}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-5 py-6 font-mono text-sm">
              <p>
                <span className="text-terminal-blue">{">"}</span>{" "}
                <span className="text-foreground">
                  fix the typo in the README
                </span>
              </p>

              <div className="mt-3 space-y-1.5">
                {TOOL_CALLS.map((call) => (
                  <div key={call.name} className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={call.icon}
                      size={13}
                      strokeWidth={1.5}
                      className="shrink-0 text-terminal-blue"
                    />
                    <span className="text-foreground">{call.name}</span>
                    <span className="text-muted-foreground">{call.target}</span>
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={13}
                      strokeWidth={1.5}
                      className="ml-auto shrink-0 text-success"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-3 overflow-x-auto border border-border bg-background/60 text-xs">
                {DIFF.map((line) => (
                  <p
                    key={line.text}
                    className={
                      line.sign === "-"
                        ? "whitespace-pre bg-destructive/10 px-3 py-1 text-destructive"
                        : "whitespace-pre bg-success/10 px-3 py-1 text-success"
                    }
                  >
                    {line.sign} {line.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
