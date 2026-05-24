import type { RefObject } from "react";
import { COMMANDS } from "./commands";
import { TextAttributes, type ScrollBoxRenderable } from "@opentui/core";
import { getFilteredCommands } from "./filter-commands";

const MAX_VISIBLE_COMMANDS = 8;

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
  const filtered = getFilteredCommands(props.query);
  const visibleHeight = Math.min(filtered.length, MAX_VISIBLE_COMMANDS);

  if (filtered.length === 0) {
    return (
      <box paddingX={1}>
        <text attributes={TextAttributes.DIM}>No matching commands</text>
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
            paddingX={1}
            height={1}
            overflow="hidden"
            backgroundColor={isSelected ? "#89B4FA" : undefined}
            onMouseMove={() => props.onSelect(index)}
            onMouseDown={() => props.onExecute(index)}
          >
            <box width={COMMAND_COL_WIDTH} flexShrink={0}>
              <text selectable={false} fg={isSelected ? "black" : "white"}>
                /{command.name}
              </text>
            </box>
            <box flexGrow={1} flexShrink={1} overflow="hidden">
              <text selectable={false} fg={isSelected ? "black" : "gray"}>
                {command.description}
              </text>
            </box>
          </box>
        );
      })}
    </scrollbox>
  );
}
