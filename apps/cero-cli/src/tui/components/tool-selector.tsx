import { SUPPORTED_AI_TOOLS } from "@cerocode/constants";
import { useKeyboard } from "@opentui/react";
import { useTheme } from "@tui/hooks/use-theme";
import { useUI } from "@tui/hooks/use-ui";
import { useCallback, useState } from "react";

export function ToolSelector() {
  const { selectedTools, toggleTool, toggleToolSelector } = useUI();
  const { colors } = useTheme();

  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleToggle = useCallback(
    (index: number) => {
      const tool = SUPPORTED_AI_TOOLS[index];
      if (tool) {
        toggleTool(tool.id);
      }
    },
    [toggleTool]
  );

  // Handle keyboard navigation within the selector
  useKeyboard((key) => {
    // Close on escape
    if (key.name === "escape") {
      toggleToolSelector();
      return;
    }

    // Navigate up
    if (key.name === "up" || key.name === "k") {
      setFocusedIndex((prev) => Math.max(0, prev - 1));
      return;
    }

    // Navigate down
    if (key.name === "down" || key.name === "j") {
      setFocusedIndex((prev) => Math.min(SUPPORTED_AI_TOOLS.length - 1, prev + 1));
      return;
    }

    // Toggle on enter or space
    if (key.name === "return" || key.name === "space") {
      handleToggle(focusedIndex);
      return;
    }

    // Quick toggle by number (1-3)
    if (key.name && /^[1-3]$/.test(key.name)) {
      const idx = Number.parseInt(key.name, 10) - 1;
      if (idx >= 0 && idx < SUPPORTED_AI_TOOLS.length) {
        handleToggle(idx);
      }
      return;
    }
  });

  return (
    <box
      style={{
        flexDirection: "column",
        border: true,
        borderStyle: "rounded",
        borderColor: colors.accent,
        marginLeft: 1,
        marginRight: 1,
        marginBottom: 1,
        padding: 1,
        flexGrow: 1,
      }}
    >
      {/* Header */}
      <box style={{ flexDirection: "row", marginBottom: 1 }}>
        <text fg={colors.accent}>🛠️ </text>
        <text fg={colors.fg1}>
          <strong>Select AI Tools</strong>
        </text>
        <text fg={colors.fg4}> • ↑↓/jk navigate • Enter/Space toggle • Esc close</text>
      </box>

      {/* Tool list */}
      {SUPPORTED_AI_TOOLS.map((tool, idx) => {
        const isSelected = selectedTools.includes(tool.id);
        const isFocused = idx === focusedIndex;
        const displayNum = idx + 1;

        return (
          <box
            key={tool.id}
            style={{
              flexDirection: "row",
              paddingLeft: 1,
              paddingRight: 1,
            }}
          >
            {/* Number shortcut */}
            <text fg={colors.fg5}>{`${displayNum}. `}</text>

            {/* Selection indicator (checkbox style) */}
            <text fg={isSelected ? colors.success : colors.fg5}>
              {isSelected ? "[✓] " : "[ ] "}
            </text>

            {/* Tool name */}
            <text fg={isFocused ? colors.warning : isSelected ? colors.fg1 : colors.fg2}>
              {isFocused ? <strong>{tool.name}</strong> : tool.name}
            </text>

            {/* Description */}
            <text fg={colors.fg4}> - {tool.description}</text>
          </box>
        );
      })}

      {/* Footer hint */}
      <box style={{ flexDirection: "row", marginTop: 1, paddingLeft: 1 }}>
        <text fg={colors.fg5}>Press 1-3 for quick toggle • Selected: </text>
        <text fg={colors.success}>
          {selectedTools.length > 0
            ? selectedTools
                .map((id) => SUPPORTED_AI_TOOLS.find((t) => t.id === id)?.name)
                .join(", ")
            : "None"}
        </text>
      </box>
    </box>
  );
}
