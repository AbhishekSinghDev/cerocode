import {
  File01Icon,
  FolderIcon,
  FolderSearchIcon,
  Search01Icon,
  FileEditIcon,
  PencilEdit02Icon,
  TerminalIcon,
} from "@hugeicons/core-free-icons";

export type Tool = {
  id: string;
  icon: typeof File01Icon;
  name: string;
  description: string;
  planSafe: boolean;
};

export const TOOLS: Tool[] = [
  {
    id: "readFile",
    icon: File01Icon,
    name: "readFile",
    description: "Reads a file's contents, truncated past 10,000 characters.",
    planSafe: true,
  },
  {
    id: "listDirectory",
    icon: FolderIcon,
    name: "listDirectory",
    description: "Lists files and folders inside the current project.",
    planSafe: true,
  },
  {
    id: "glob",
    icon: FolderSearchIcon,
    name: "glob",
    description: "Finds files by pattern, capped at 200 results.",
    planSafe: true,
  },
  {
    id: "grep",
    icon: Search01Icon,
    name: "grep",
    description: "Searches file contents for a pattern, up to 50 matches.",
    planSafe: true,
  },
  {
    id: "writeFile",
    icon: FileEditIcon,
    name: "writeFile",
    description: "Creates or overwrites a file. Waits for your approval first.",
    planSafe: false,
  },
  {
    id: "editFile",
    icon: PencilEdit02Icon,
    name: "editFile",
    description: "Applies a targeted diff to an existing file. Also gated.",
    planSafe: false,
  },
  {
    id: "bash",
    icon: TerminalIcon,
    name: "bash",
    description: "Runs a shell command in the project directory, 30s timeout.",
    planSafe: false,
  },
];