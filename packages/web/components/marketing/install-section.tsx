"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";

const SETUP_LINES = [
  { prompt: "$", text: "bun add -g cerocode", note: "install the CLI globally" },
  { prompt: "$", text: "cd your-project", note: "run it inside any project" },
  { prompt: "$", text: "cerocode", note: "start the TUI" },
  { prompt: ">", text: "/login", note: "opens your browser to sign in" },
];

const TOOL_CALLS = [
  { icon: File01Icon, name: "readFile", target: "README.md" },
  { icon: PencilEdit02Icon, name: "editFile", target: "README.md" },
];

const DIFF = [
  { sign: "-", text: "cerocode is a terminal AI coding agent" },
  { sign: "+", text: "cerocode is a terminal-native AI coding agent" },
];

const INSTALL_COMMAND = "bun add -g cerocode";

export function InstallSection() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable; the command is already visible to copy by hand.
    }
  }

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
                onClick={handleCopy}
                className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <HugeiconsIcon
                  icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
                  size={13}
                  strokeWidth={1.5}
                  className={copied ? "text-[#82E0AA]" : undefined}
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
                    <span className="text-[#89B4FA]">{line.prompt}</span>{" "}
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
                <span className="text-[#89B4FA]">{">"}</span>{" "}
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
                      className="shrink-0 text-[#89B4FA]"
                    />
                    <span className="text-foreground">{call.name}</span>
                    <span className="text-muted-foreground">{call.target}</span>
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={13}
                      strokeWidth={1.5}
                      className="ml-auto shrink-0 text-[#82E0AA]"
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
                        : "whitespace-pre bg-[#82E0AA]/10 px-3 py-1 text-[#82E0AA]"
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
