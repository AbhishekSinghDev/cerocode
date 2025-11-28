import { useTheme } from "@tui/hooks/use-theme";
import type { Command } from "types/tui.type";

export const COMMANDS: Command[] = [
  { key: "n", description: "New chat", context: "global" },
  { key: "Tab", description: "Switch focus", context: "global" },
  { key: "Ctrl+T", description: "Change theme", context: "global" },
  { key: "b", description: "Toggle sidebar", context: "sidebar" },
  { key: "↑↓", description: "Navigate history", context: "sidebar" },
  { key: "Enter", description: "Select chat", context: "sidebar" },
  { key: "m", description: "Change model", context: "chat" },
  { key: "1-5", description: "Quick select model", context: "chat" },
  { key: "Esc", description: "Exit / Close", context: "global" },
];

interface CommandsDisplayProps {
  showFull?: boolean;
  compact?: boolean;
}

export function CommandsDisplay({ showFull = false, compact = false }: CommandsDisplayProps) {
  const { colors } = useTheme();

  if (compact) {
    return (
      <box style={{ flexDirection: "column", paddingLeft: 1, height: 3 }}>
        <text fg={colors.fg4}>─── Keys ───</text>
        <box style={{ flexDirection: "row" }}>
          <text fg={colors.fg5}>[n]</text>
          <text fg={colors.fg4}> new </text>
          <text fg={colors.fg5}>[b]</text>
          <text fg={colors.fg4}> sidebar</text>
        </box>
        <box style={{ flexDirection: "row" }}>
          <text fg={colors.fg5}>[↑↓]</text>
          <text fg={colors.fg4}> nav </text>
          <text fg={colors.fg5}>[↵]</text>
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
          <text fg={colors.fg5}>Agentic CLI</text>
        </box>

        {/* Welcome message */}
        <box style={{ marginBottom: 1 }}>
          <text fg={colors.fg4}>Welcome! Start typing or use these commands:</text>
        </box>

        {/* Commands box */}
        <box
          style={{
            flexDirection: "column",
            border: true,
            borderStyle: "rounded",
            borderColor: colors.border1,
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 1,
            paddingBottom: 1,
            backgroundColor: colors.bg2,
            width: 50,
          }}
        >
          <text fg={colors.primary} style={{ marginBottom: 1 }}>
            <strong>⌨ Keyboard Shortcuts</strong>
          </text>

          {/* Global */}
          <text fg={colors.border2} style={{ marginBottom: 1 }}>
            ─ Global ─
          </text>
          <box style={{ flexDirection: "column", marginBottom: 1, paddingLeft: 1 }}>
            <box style={{ flexDirection: "row", marginBottom: 1 }}>
              <text fg={colors.primary} style={{ width: 10 }}>
                <strong>n</strong>
              </text>
              <text fg={colors.fg2}>New chat</text>
            </box>
            <box style={{ flexDirection: "row", marginBottom: 1 }}>
              <text fg={colors.primary} style={{ width: 10 }}>
                <strong>Tab</strong>
              </text>
              <text fg={colors.fg2}>Switch focus</text>
            </box>
            <box style={{ flexDirection: "row", marginBottom: 1 }}>
              <text fg={colors.primary} style={{ width: 10 }}>
                <strong>Ctrl+T</strong>
              </text>
              <text fg={colors.fg2}>Change theme</text>
            </box>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 10 }}>
                <strong>Esc</strong>
              </text>
              <text fg={colors.fg2}>Exit / Close</text>
            </box>
          </box>

          {/* Sidebar */}
          <text fg={colors.border2} style={{ marginBottom: 1 }}>
            ─ Sidebar ─
          </text>
          <box style={{ flexDirection: "column", marginBottom: 1, paddingLeft: 1 }}>
            <box style={{ flexDirection: "row", marginBottom: 1 }}>
              <text fg={colors.primary} style={{ width: 10 }}>
                <strong>b</strong>
              </text>
              <text fg={colors.fg2}>Toggle sidebar</text>
            </box>
            <box style={{ flexDirection: "row", marginBottom: 1 }}>
              <text fg={colors.primary} style={{ width: 10 }}>
                <strong>↑↓ j/k</strong>
              </text>
              <text fg={colors.fg2}>Navigate history</text>
            </box>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 10 }}>
                <strong>Enter</strong>
              </text>
              <text fg={colors.fg2}>Select chat</text>
            </box>
          </box>

          {/* Chat */}
          <text fg={colors.border2} style={{ marginBottom: 1 }}>
            ─ Chat ─
          </text>
          <box style={{ flexDirection: "column", paddingLeft: 1 }}>
            <box style={{ flexDirection: "row", marginBottom: 1 }}>
              <text fg={colors.primary} style={{ width: 10 }}>
                <strong>m</strong>
              </text>
              <text fg={colors.fg2}>Change AI model</text>
            </box>
            <box style={{ flexDirection: "row" }}>
              <text fg={colors.primary} style={{ width: 10 }}>
                <strong>1-5</strong>
              </text>
              <text fg={colors.fg2}>Quick model select</text>
            </box>
          </box>
        </box>

        <box style={{ marginTop: 1, flexDirection: "row" }}>
          <text fg={colors.fg4}>Press </text>
          <text fg={colors.primary}>
            <strong>[n]</strong>
          </text>
          <text fg={colors.fg4}> to start a new chat</text>
        </box>
      </box>
    );
  }

  return null;
}
