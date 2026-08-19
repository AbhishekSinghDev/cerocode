import { TOOLS, type Tool } from "./tools";

export type ToolCall = Tool & {
  target: string;
  gate?: boolean;
};

export const TOOL_CALLS: ToolCall[] = [
  {
    ...TOOLS.find((tool) => tool.id === "readFile")!,
    target: "src/routes/upload.ts",
  },
  {
    ...TOOLS.find((tool) => tool.id === "grep")!,
    target: '"catch" src/routes',
  },
  {
    ...TOOLS.find((tool) => tool.id === "editFile")!,
    target: "src/routes/upload.ts",
    gate: true,
  },
];

export const REPLY =
  "Wrapped the multipart parse in a try/catch and return a 400 with a clear message on failure.";

// Step timeline, in order. Each step becomes visible once its index is
// reached; the approval gate holds until "approved" fires, then the reply
// streams in. Motivated by storytelling: it walks a visitor through the
// exact tool-call → approval → response loop the CLI actually runs.
export type Step =
  | "boot"
  | "user"
  | "tool-0"
  | "tool-1"
  | "tool-2-pending"
  | "tool-2-approved"
  | "reply"
  | "done";

export const STEP_ORDER: Step[] = [
  "boot",
  "user",
  "tool-0",
  "tool-1",
  "tool-2-pending",
  "tool-2-approved",
  "reply",
  "done",
];

export const STEP_DELAYS: Partial<Record<Step, number>> = {
  boot: 500,
  user: 700,
  "tool-0": 550,
  "tool-1": 550,
  "tool-2-pending": 900,
  "tool-2-approved": 500,
  reply: 0,
};