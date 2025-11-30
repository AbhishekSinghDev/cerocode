import { useTheme } from "@tui/hooks/use-theme";
import { useUI } from "@tui/hooks/use-ui";
import type { Command } from "types/tui.type";

export const COMMANDS: Command[] = [
  { key: "n", description: "New chat", context: "global" },
  { key: "Tab", description: "Switch focus", context: "global" },
  { key: "Ctrl+T", description: "Change theme", context: "global" },
  { key: "b", description: "Toggle sidebar", context: "sidebar" },
  { key: "↑↓", description: "Navigate history", context: "sidebar" },
  { key: "Enter", description: "Select chat", context: "sidebar" },
  { key: "/m", description: "Change model", context: "chat" },
  { key: "/t", description: "Toggle tools", context: "chat" },
  { key: "Esc", description: "Exit / Close", context: "global" },
];

interface CommandsDisplayProps {
  showFull?: boolean;
  compact?: boolean;
}

export function CommandsDisplay({ showFull = false, compact = false }: CommandsDisplayProps) {
  const { colors } = useTheme();
  const { modelSelectorOpen, toolSelectorOpen } = useUI();

  if (modelSelectorOpen || toolSelectorOpen) return null;

  if (compact) {
    return (
      <box
        style={{
          flexDirection: "column",
          paddingLeft: 1,
          height: 5,
          border: true,
          borderColor: colors.border3,
          borderStyle: "rounded",
        }}
      >
        <text fg={colors.fg4}>Keys</text>
        <box style={{ flexDirection: "row" }}>
          <text fg={colors.accent}>[n]</text>
          <text fg={colors.fg4}> new </text>
          <text fg={colors.accent}>[b]</text>
          <text fg={colors.fg4}> sidebar</text>
        </box>
        <box style={{ flexDirection: "row" }}>
          <text fg={colors.accent}>[↑↓]</text>
          <text fg={colors.fg4}> nav </text>
          <text fg={colors.accent}>[↵]</text>
          <text fg={colors.fg4}> select</text>
        </box>
      </box>
    );
  }

  if (showFull) {
    return (
      <box
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          paddingBottom: 2,
        }}
      >
        {/* Logo */}
        <box style={{ marginBottom: 1, flexDirection: "column", alignItems: "center" }}>
          <text fg={colors.primary}>
            <strong>CEROCODE</strong>
          </text>
          <text fg={colors.fg4}>Agentic CLI</text>
        </box>

        {/* Welcome message */}
        <box style={{ marginBottom: 1 }}>
          <text fg={colors.fg3}>Start a conversation or use keyboard shortcuts below</text>
        </box>

        {/* Commands box */}
        <box
          style={{
            flexDirection: "column",
            border: true,
            borderStyle: "rounded",
            borderColor: colors.border2,
            paddingLeft: 3,
            paddingRight: 3,
            paddingTop: 1,
            paddingBottom: 1,
            width: 56,
          }}
        >
          {/* Header */}
          <box style={{ flexDirection: "row", marginBottom: 1 }}>
            <text fg={colors.primary}>⌨ </text>
            <text fg={colors.fg1}>
              <strong>Keyboard Shortcuts</strong>
            </text>
          </box>

          {/* Divider */}
          <text fg={colors.border1}>────────────────────────────────────────────────</text>

          {/* Global Section */}
          <box style={{ marginTop: 1, marginBottom: 1 }}>
            <text fg={colors.accent}>
              <strong>● Global</strong>
            </text>
          </box>
          <box style={{ flexDirection: "column", paddingLeft: 2 }}>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 12 }}>
                n
              </text>
              <text fg={colors.fg3}>→</text>
              <text fg={colors.fg2}> Start new chat</text>
            </box>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 12 }}>
                Tab
              </text>
              <text fg={colors.fg3}>→</text>
              <text fg={colors.fg2}> Switch between sidebar & chat</text>
            </box>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 12 }}>
                Ctrl+T
              </text>
              <text fg={colors.fg3}>→</text>
              <text fg={colors.fg2}> Cycle through themes</text>
            </box>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 12 }}>
                Esc
              </text>
              <text fg={colors.fg3}>→</text>
              <text fg={colors.fg2}> Exit application</text>
            </box>
          </box>

          {/* Sidebar Section */}
          <box style={{ marginTop: 1, marginBottom: 1 }}>
            <text fg={colors.accent}>
              <strong>● Sidebar</strong>
            </text>
          </box>
          <box style={{ flexDirection: "column", paddingLeft: 2 }}>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 12 }}>
                b
              </text>
              <text fg={colors.fg3}>→</text>
              <text fg={colors.fg2}> Toggle sidebar visibility</text>
            </box>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 12 }}>
                ↑ ↓ / j k
              </text>
              <text fg={colors.fg3}>→</text>
              <text fg={colors.fg2}> Navigate chat history</text>
            </box>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 12 }}>
                Enter
              </text>
              <text fg={colors.fg3}>→</text>
              <text fg={colors.fg2}> Open selected chat</text>
            </box>
          </box>

          {/* Chat Section */}
          <box style={{ marginTop: 1, marginBottom: 1 }}>
            <text fg={colors.accent}>
              <strong>● Chat Input</strong>
            </text>
          </box>
          <box style={{ flexDirection: "column", paddingLeft: 2 }}>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 12 }}>
                /m + Enter
              </text>
              <text fg={colors.fg3}>→</text>
              <text fg={colors.fg2}> Open model selector</text>
            </box>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 12 }}>
                /t + Enter
              </text>
              <text fg={colors.fg3}>→</text>
              <text fg={colors.fg2}> Open tool selector</text>
            </box>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 12 }}>
                Enter
              </text>
              <text fg={colors.fg3}>→</text>
              <text fg={colors.fg2}> Send message</text>
            </box>
          </box>
        </box>

        {/* Footer hint */}
        <box style={{ marginTop: 1, flexDirection: "row" }}>
          <text fg={colors.fg4}>Press </text>
          <text fg={colors.primary}>
            <strong>n</strong>
          </text>
          <text fg={colors.fg4}>
            {" "}
            to start chatting or select a conversation from the sidebar
          </text>
        </box>

        {/* Version info */}
        <box style={{ marginTop: 1 }}>
          <text fg={colors.fg5}>v0.1.0 • github.com/cerocode</text>
        </box>
      </box>
    );
  }

  return null;
}
