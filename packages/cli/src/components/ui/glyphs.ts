// Shared glyph set for CeroCode's own visual language.
// Kept deliberately small and terminal-native (box-drawing / typographic
// symbols only, no emoji) so it reads consistently across every theme.
export const GLYPH = {
  brand: "◆",
  cursor: "❯",
  success: "✓",
  error: "✕",
  info: "●",
  warn: "▲",
  dir: "▸",
  file: "·",
  dot: "·",
  thinking: "…",
} as const;
