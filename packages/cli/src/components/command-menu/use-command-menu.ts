import type { ScrollBoxRenderable } from "@opentui/core";
import { useMemo, useRef, useState, type RefObject } from "react";
import type { Command } from "./types";
import { getFilteredCommands } from "./filter-commands";
import { useKeyboard } from "@opentui/react";

type UseCommandMenuReturn = {
  showCommandMenu: boolean;
  commandQuery: string;
  selectedIndex: number;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
  handleContentChange: (query: string) => void;
  resolveCommand: (index: number) => Command | undefined;
  setSelectedIndex: (index: number) => void;
};

export function useCommandMenu(): UseCommandMenuReturn {
  const [textValue, setTextValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const scrollRef = useRef<ScrollBoxRenderable | null>(null);

  const commandQuery =
    showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

  const filteredCommands = useMemo(
    () => getFilteredCommands(commandQuery),
    [commandQuery],
  );

  const handleContentChange = (value: string) => {
    setTextValue(value);
    setSelectedIndex(0);

    const scrollbox = scrollRef.current;
    if (scrollbox) {
      scrollbox.scrollTo(0);
    }

    const prefix = value.startsWith("/") ? value.slice(1) : null;
    if (prefix !== null && !prefix.includes(" ")) {
      setShowCommandMenu(true);
    } else {
      setShowCommandMenu(false);
    }
  };

  const resolveCommand = (index: number): Command | undefined => {
    const command = filteredCommands[index];
    if (command) {
      setShowCommandMenu(false);
    }

    return command;
  };

  useKeyboard((key) => {
    if (!showCommandMenu) return;

    if (key.name === "escape") {
      key.preventDefault();
      setShowCommandMenu(false);
    } else if (key.name === "up") {
      key.preventDefault();
      setSelectedIndex((i: number) => {
        const newIndex = Math.max(0, i - 1);

        const sb = scrollRef.current;
        if (sb && newIndex < sb.scrollTop) {
          sb.scrollTo(newIndex);
        }
        return newIndex;
      });
    } else if (key.name === "down") {
      setSelectedIndex((i: number) => {
        if (filteredCommands.length === 0) return 0;

        const newIndex = Math.min(filteredCommands.length - 1, i + 1);
        const sb = scrollRef.current;
        if (sb) {
          const viewportHeight = sb.viewport.height;
          const visibledEnd = sb.scrollTop + viewportHeight - 1;
          if (newIndex > visibledEnd) {
            sb.scrollTo(newIndex - viewportHeight + 1);
          }
        }
        return newIndex;
      });
    }
  });

  return {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  };
}
