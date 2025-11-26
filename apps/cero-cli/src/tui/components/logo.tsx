// Compact ASCII Logo for CEROCODE
export const LOGO_LINES = [
  "┌─────────────────────┐",
  "│  ╔═╗╔═╗╦═╗╔═╗╔═╗╔═╗ │",
  "│  ║  ║╣ ╠╦╝║ ║║  ║ ║ │",
  "│  ╚═╝╚═╝╩╚═╚═╝╚═╝╚═╝ │",
  "│    D E   CEROCODE   │",
  "└─────────────────────┘",
]

// Even more compact version
export const LOGO_MINI = ["◆ CEROCODE"]

// Sleek inline logo
export const LOGO_INLINE = "◆ CEROCODE"

export function Logo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <box style={{ height: 1 }}>
        <text fg="#00ff88">◆ </text>
        <text fg="#ffffff"><strong>CERO</strong></text>
        <text fg="#00ff88">CODE</text>
      </box>
    )
  }

  return (
    <box style={{ flexDirection: "column", height: 2 }}>
      <text fg="#00ff88"><strong>◆ CEROCODE</strong></text>
      <text fg="#555555">AI-Powered CLI</text>
    </box>
  )
}
