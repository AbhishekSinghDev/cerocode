"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  File01Icon,
  Search01Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type ToolCall = {
  icon: typeof File01Icon;
  name: string;
  target: string;
  gate?: boolean;
};

const TOOL_CALLS: ToolCall[] = [
  { icon: File01Icon, name: "readFile", target: "src/routes/upload.ts" },
  { icon: Search01Icon, name: "grep", target: '"catch" src/routes' },
  {
    icon: PencilEdit02Icon,
    name: "editFile",
    target: "src/routes/upload.ts",
    gate: true,
  },
];

const REPLY =
  "Wrapped the multipart parse in a try/catch and return a 400 with a clear message on failure.";

// Step timeline, in order. Each step becomes visible once its index is
// reached; the approval gate holds until "approved" fires, then the reply
// streams in. Motivated by storytelling: it walks a visitor through the
// exact tool-call → approval → response loop the CLI actually runs.
type Step =
  | "boot"
  | "user"
  | "tool-0"
  | "tool-1"
  | "tool-2-pending"
  | "tool-2-approved"
  | "reply"
  | "done";

const STEP_ORDER: Step[] = [
  "boot",
  "user",
  "tool-0",
  "tool-1",
  "tool-2-pending",
  "tool-2-approved",
  "reply",
  "done",
];

export function TerminalPreview() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [stepIndex, setStepIndex] = useState(reduce ? STEP_ORDER.length - 1 : 0);
  const [replyChars, setReplyChars] = useState(reduce ? REPLY.length : 0);

  useEffect(() => {
    if (reduce || !inView) return;
    if (stepIndex >= STEP_ORDER.length - 1) return;

    const delays: Partial<Record<Step, number>> = {
      boot: 500,
      user: 700,
      "tool-0": 550,
      "tool-1": 550,
      "tool-2-pending": 900,
      "tool-2-approved": 500,
      reply: 0,
    };

    const current = STEP_ORDER[stepIndex] ?? "done";
    const wait = delays[current] ?? 500;
    const timer = setTimeout(() => setStepIndex((i) => i + 1), wait);
    return () => clearTimeout(timer);
  }, [inView, reduce, stepIndex]);

  useEffect(() => {
    if (reduce) return;
    if (STEP_ORDER[stepIndex] !== "reply") return;

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setReplyChars(i);
      if (i >= REPLY.length) {
        clearInterval(interval);
        setStepIndex((s) => Math.min(s + 1, STEP_ORDER.length - 1));
      }
    }, 18);
    return () => clearInterval(interval);
  }, [reduce, stepIndex]);

  const step = STEP_ORDER[stepIndex];
  const stepAt = (s: Step) => STEP_ORDER.indexOf(s) <= stepIndex;

  return (
    <div
      ref={ref}
      className="relative w-full border border-border bg-[#0d0d12] font-mono text-[13px] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]"
    >
      <div className="flex h-9 items-center justify-between border-b border-border/80 px-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 bg-[#6C7086]" />
            <span className="size-2 bg-[#6C7086]" />
            <span className="size-2 bg-[#6C7086]" />
          </div>
          <span className="text-[11px] text-[#6C7086]">cerocode</span>
        </div>
        <span className="border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[10px] tracking-wide text-primary">
          BUILD
        </span>
      </div>

      <div className="min-h-[280px] px-4 py-4">
        <p className="text-[#6C7086]">
          <span className="text-[#89B4FA]">$</span> cerocode
        </p>

        <div
          className={cn(
            "mt-4 space-y-3 transition-opacity duration-300",
            stepAt("user") ? "opacity-100" : "opacity-0",
          )}
        >
          <p className="text-[#E1E1E1]">
            <span className="text-[#6C7086]">you ›</span> add error handling
            to the upload handler
          </p>

          <div className="space-y-1.5">
            {TOOL_CALLS.map((call, i) => {
              const key = `tool-${i}` as Step;
              const visible = stepAt(key);
              const pending =
                call.gate &&
                step === "tool-2-pending" &&
                !stepAt("tool-2-approved");
              const approved = call.gate ? stepAt("tool-2-approved") : visible;

              if (!visible) return null;

              return (
                <div key={call.name} className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={call.icon}
                    size={13}
                    strokeWidth={1.5}
                    className="shrink-0 text-[#89B4FA]"
                  />
                  <span className="text-[#E1E1E1]">{call.name}</span>
                  <span className="text-[#6C7086]">{call.target}</span>
                  {pending ? (
                    <span className="ml-auto text-[10px] text-[#89B4FA]">
                      apply edit? (y/n)
                    </span>
                  ) : approved ? (
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={13}
                      strokeWidth={1.5}
                      className="ml-auto shrink-0 text-[#82E0AA]"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          {stepAt("reply") ? (
            <p className="pt-1 leading-relaxed text-[#E1E1E1]">
              {REPLY.slice(0, replyChars)}
              <BlinkingCursor />
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex h-8 items-center justify-between border-t border-border/80 px-3 text-[11px]">
        <span>
          <span className="text-primary">build</span>
          <span className="text-[#6C7086]"> › </span>
          <span className="text-[#E1E1E1]">devstral-small-latest</span>
        </span>
        <span className="text-[#6C7086]">12,486 tokens</span>
      </div>
    </div>
  );
}

function BlinkingCursor() {
  return (
    <motion.span
      aria-hidden="true"
      className="ml-0.5 inline-block h-3.5 w-[7px] translate-y-0.5 bg-primary align-middle"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
    />
  );
}
