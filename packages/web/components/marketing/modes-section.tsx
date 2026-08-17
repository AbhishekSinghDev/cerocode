"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  File01Icon,
  FolderIcon,
  FolderSearchIcon,
  Search01Icon,
  PencilEdit02Icon,
  FileEditIcon,
  TerminalIcon,
  LockIcon,
} from "@hugeicons/core-free-icons";
import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

type ToolDef = { icon: typeof File01Icon; name: string; planSafe: boolean };

const TOOLS: ToolDef[] = [
  { icon: File01Icon, name: "readFile", planSafe: true },
  { icon: FolderIcon, name: "listDirectory", planSafe: true },
  { icon: FolderSearchIcon, name: "glob", planSafe: true },
  { icon: Search01Icon, name: "grep", planSafe: true },
  { icon: FileEditIcon, name: "writeFile", planSafe: false },
  { icon: PencilEdit02Icon, name: "editFile", planSafe: false },
  { icon: TerminalIcon, name: "bash", planSafe: false },
];

type ModeId = "BUILD" | "PLAN";

export function ModesSection() {
  const [mode, setMode] = useState<ModeId>("BUILD");

  return (
    <section id="modes" className="border-t border-border py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading
            title="Two agents, one keystroke."
            description="Tab switches between full read, write, and bash access and a read-only agent for planning before you touch anything."
          />

          <div className="mt-8 inline-flex border border-border" role="tablist" aria-label="Agent mode">
            {(["BUILD", "PLAN"] as ModeId[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  "px-5 py-2 font-mono text-xs tracking-wide transition-colors",
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {mode === "BUILD"
              ? "Full access. The agent can write files and run shell commands, each gated behind your approval."
              : "Read-only. The agent can explore and explain the codebase, but nothing on disk changes."}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-px border border-border bg-border">
            {TOOLS.map((tool) => {
              const enabled = mode === "BUILD" || tool.planSafe;
              return (
                <div
                  key={tool.name}
                  className={cn(
                    "flex items-center gap-2.5 bg-card px-4 py-3.5 font-mono text-sm transition-opacity",
                    !enabled && "opacity-40",
                  )}
                >
                  <HugeiconsIcon
                    icon={tool.icon}
                    size={15}
                    strokeWidth={1.5}
                    className={enabled ? "shrink-0 text-primary" : "shrink-0 text-muted-foreground"}
                  />
                  <span className={cn("truncate", enabled ? "text-foreground" : "text-muted-foreground")}>
                    {tool.name}
                  </span>
                  {!enabled ? (
                    <HugeiconsIcon
                      icon={LockIcon}
                      size={12}
                      strokeWidth={1.5}
                      className="ml-auto shrink-0 text-muted-foreground"
                    />
                  ) : null}
                </div>
              );
            })}
            <div className="bg-background" aria-hidden="true" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
