// Keyboard shortcuts/commands reference
export interface Command {
  key: string
  description: string
  context?: "global" | "sidebar" | "chat"
}

export const COMMANDS: Command[] = [
  { key: "n", description: "New chat", context: "global" },
  { key: "Tab", description: "Switch focus", context: "global" },
  { key: "b", description: "Toggle sidebar", context: "sidebar" },
  { key: "↑↓", description: "Navigate history", context: "sidebar" },
  { key: "Enter", description: "Select chat", context: "sidebar" },
  { key: "m", description: "Change model", context: "chat" },
  { key: "1-5", description: "Quick select model", context: "chat" },
  { key: "Esc", description: "Exit / Close", context: "global" },
]

interface CommandsDisplayProps {
  showFull?: boolean
  compact?: boolean
}

export function CommandsDisplay({ showFull = false, compact = false }: CommandsDisplayProps) {
  if (compact) {
    return (
      <box style={{ flexDirection: "column", paddingLeft: 1 }}>
        <text fg="#444444">─── Keys ───</text>
        <box style={{ flexDirection: "row" }}>
          <text fg="#555555">[n]</text>
          <text fg="#444444"> new </text>
          <text fg="#555555">[b]</text>
          <text fg="#444444"> sidebar</text>
        </box>
        <box style={{ flexDirection: "row" }}>
          <text fg="#555555">[↑↓]</text>
          <text fg="#444444"> nav </text>
          <text fg="#555555">[↵]</text>
          <text fg="#444444"> select</text>
        </box>
      </box>
    )
  }

  if (showFull) {
    return (
      <box
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        {/* Logo */}
        <box style={{ marginBottom: 1, flexDirection: "column", alignItems: "center" }}>
          <text fg="#00ff88">
            <strong>◆ CEROCODE</strong>
          </text>
          <text fg="#555555">AI-Powered CLI</text>
        </box>

        {/* Welcome message */}
        <box style={{ marginBottom: 1 }}>
          <text fg="#666666">Welcome! Start typing or use these commands:</text>
        </box>

        {/* Commands box */}
        <box
          style={{
            flexDirection: "column",
            border: true,
            borderStyle: "single",
            borderColor: "#222222",
            paddingLeft: 1,
            paddingRight: 1,
            backgroundColor: "#0a0a0a",
            width: 40,
          }}
        >
          <text fg="#888888">
            <strong>⌨ Keyboard Shortcuts</strong>
          </text>

          {/* Global */}
          <text fg="#444444">── Global ──</text>
          <text>
            <span fg="#00ff88">n       </span>
            <span fg="#888888">New chat</span>
          </text>
          <text>
            <span fg="#00ff88">Tab     </span>
            <span fg="#888888">Switch focus</span>
          </text>
          <text>
            <span fg="#00ff88">Esc     </span>
            <span fg="#888888">Exit / Close</span>
          </text>

          {/* Sidebar */}
          <text fg="#444444">── Sidebar ──</text>
          <text>
            <span fg="#00ff88">b       </span>
            <span fg="#888888">Toggle sidebar</span>
          </text>
          <text>
            <span fg="#00ff88">↑↓ j/k  </span>
            <span fg="#888888">Navigate history</span>
          </text>
          <text>
            <span fg="#00ff88">Enter   </span>
            <span fg="#888888">Select chat</span>
          </text>

          {/* Chat */}
          <text fg="#444444">── Chat ──</text>
          <text>
            <span fg="#00ff88">m       </span>
            <span fg="#888888">Change AI model</span>
          </text>
          <text>
            <span fg="#00ff88">1-5     </span>
            <span fg="#888888">Quick model select</span>
          </text>
        </box>

        <box style={{ marginTop: 1, flexDirection: "row" }}>
          <text fg="#444444">Press [</text>
          <text fg="#00ff88">n</text>
          <text fg="#444444">] to start a new chat</text>
        </box>
      </box>
    )
  }

  return null
}
