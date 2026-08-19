import {
  TextAttributes,
  type InputRenderable,
  type ScrollBoxRenderable,
} from "@opentui/core";
import { useCallback, useRef, useState } from "react";
import { useKeyboardLayer } from "../providers/kebboard";
import { useKeyboard } from "@opentui/react";
import { useTheme } from "../providers/theme";
import { GLYPH } from "./ui/glyphs";
import { MAX_VISIBLE_DIALOG_ITEMS } from "./ui/list-constants";
import { useListNavigation } from "../hooks/use-list-navigation";

type DialogSearchListProps<T> = {
  items: T[];
  onSelect: (item: T) => void;
  onHighlight?: (item: T) => void;
  filterFn: (item: T, query: string) => boolean;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  getKey: (item: T) => string;
  placeholder?: string;
  emptyText?: string;
};

export function DialogSearchList<T>(props: DialogSearchListProps<T>) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<InputRenderable>(null);
  const scrollRef = useRef<ScrollBoxRenderable>(null);
  const { theme } = useTheme();

  const { isTop } = useKeyboardLayer();

  const handleContentChange = useCallback(() => {
    const text = inputRef.current?.value ?? "";
    setSearchValue(text);
    setSelectedIndex(0);

    const scrollbox = scrollRef.current;
    if (scrollbox) {
      scrollbox.scrollTo(0);
    }
  }, []);

  const filtered = searchValue
    ? props.items.filter((item) => props.filterFn(item, searchValue))
    : props.items;

  const visibleHeight = Math.min(filtered.length, MAX_VISIBLE_DIALOG_ITEMS);

  const { moveSelection } = useListNavigation(filtered.length, scrollRef);

  useKeyboard((key) => {
    if (!isTop("dialog")) return;

    if (key.name === "return" || key.name === "enter") {
      const item = filtered[selectedIndex];
      if (item) {
        props.onSelect(item);
      }
    } else if (key.name === "up") {
      setSelectedIndex((i) => {
        const newIndex = moveSelection("up", i);
        const item = filtered[newIndex];
        if (item && props.onHighlight) props.onHighlight(item);
        return newIndex;
      });
    } else if (key.name === "down") {
      setSelectedIndex((i) => {
        const newIndex = moveSelection("down", i);
        const item = filtered[newIndex];
        if (item && props.onHighlight) props.onHighlight(item);
        return newIndex;
      });
    }
  });

  return (
    <box flexDirection="column" gap={1}>
      <input
        ref={inputRef}
        placeholder={props.placeholder ?? "Search..."}
        focused
        onContentChange={handleContentChange}
      />

      {filtered.length === 0 ? (
        <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
          {props.emptyText ?? "No results found."}
        </text>
      ) : (
        <scrollbox ref={scrollRef} height={visibleHeight}>
          {filtered.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <box
                key={props.getKey(item)}
                flexDirection="row"
                gap={1}
                paddingX={1}
                height={1}
                overflow="hidden"
                backgroundColor={isSelected ? theme.colors.selection : undefined}
                onMouseMove={() => {
                  setSelectedIndex(index);
                  if (props.onHighlight) props.onHighlight(item);
                }}
                onMouseDown={() => props.onSelect(item)}
              >
                <box width={1} flexShrink={0}>
                  <text
                    selectable={false}
                    fg={isSelected ? theme.colors.textOnSelection : theme.colors.textMuted}
                  >
                    {isSelected ? GLYPH.cursor : " "}
                  </text>
                </box>
                {props.renderItem(item, isSelected)}
              </box>
            );
          })}
        </scrollbox>
      )}
    </box>
  );
}
