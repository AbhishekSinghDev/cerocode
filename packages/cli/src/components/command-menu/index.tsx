import type { RefObject } from "react";
import { COMMANDS } from "./commands";
import { TextAttributes, type ScrollBoxRenderable } from "@opentui/core";
import { getFilteredCommands } from "./filter-commands";
import { useTheme } from "../../providers/theme";
import { GLYPH } from "../ui/glyphs";
import { MAX_VISIBLE_COMMANDS } from "../ui/list-constants";

const COMMAND_COL_WIDTH =
  Math.max(...COMMANDS.map((command) => command.name.length)) + 4;

type CommandMenuProps = {
  query: string;
  selectedIndex: number;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
  onSelect: (index: number) => void;
  onExecute: (index: number) => void;
};

export function CommandMenu(props: CommandMenuProps) {
  const { theme } = useTheme();
  const filtered = getFilteredCommands(props.query);
  const visibleHeight = Math.min(filtered.length, MAX_VISIBLE_COMMANDS);

  if (filtered.length === 0) {
    return (
      <box paddingX={1}>
        <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
          No matching commands
        </text>
      </box>
    );
  }

  return (
    <scrollbox ref={props.scrollRef} height={visibleHeight}>
      {filtered.map((command, index) => {
        const isSelected = index === props.selectedIndex;

        return (
          <box
            key={command.value}
            flexDirection="row"
            gap={1}
            paddingX={1}
            height={1}
            overflow="hidden"
            backgroundColor={isSelected ? theme.colors.selection : undefined}
            onMouseMove={() => props.onSelect(index)}
            onMouseDown={() => props.onExecute(index)}
          >
            <box width={1} flexShrink={0}>
              <text
                selectable={false}
                fg={isSelected ? theme.colors.textOnSelection : theme.colors.textMuted}
              >
                {isSelected ? GLYPH.cursor : " "}
              </text>
            </box>
            <box width={COMMAND_COL_WIDTH} flexShrink={0}>
              <text
                selectable={false}
                fg={isSelected ? theme.colors.textOnSelection : theme.colors.primary}
              >
                /{command.name}
              </text>
            </box>
            <box flexGrow={1} flexShrink={1} overflow="hidden">
              <text
                selectable={false}
                fg={isSelected ? theme.colors.textOnSelection : theme.colors.textMuted}
              >
                {command.description}
              </text>
            </box>
          </box>
        );
      })}
    </scrollbox>
  );
}
