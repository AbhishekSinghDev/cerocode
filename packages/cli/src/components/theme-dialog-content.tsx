import { useTheme } from "../providers/theme";
import { useDialog } from "../providers/dialog";
import { DialogSearchList } from "./dialog-search-list";
import { TextAttributes } from "@opentui/core";
import type { Theme } from "../providers/theme/types";

export function ThemeDialogContent() {
  const { theme, setTheme, themes } = useTheme();
  const dialog = useDialog();

  return (
    <DialogSearchList
      items={themes}
      placeholder="Search themes..."
      emptyText="No themes found"
      getKey={(t) => t.id}
      filterFn={(t, query) =>
        t.name.toLowerCase().startsWith(query.toLowerCase())
      }
      renderItem={(t, isSelected) => (
        <>
          <box width={20} flexShrink={0}>
            <text
              selectable={false}
              fg={isSelected ? theme.colors.textOnSelection : theme.colors.text}
            >
              {t.name}
            </text>
          </box>
          <box flexGrow={1} overflow="hidden">
            <text
              selectable={false}
              fg={
                isSelected ? theme.colors.textOnSelection : theme.colors.textMuted
              }
            >
              {t.description}
            </text>
          </box>
          {t.id === theme.id && (
            <text
              selectable={false}
              fg={
                isSelected ? theme.colors.textOnSelection : theme.colors.primary
              }
              attributes={TextAttributes.BOLD}
            >
              {" "}active
            </text>
          )}
        </>
      )}
      onHighlight={(t) => {
        setTheme(t);
      }}
      onSelect={(t) => {
        setTheme(t);
        dialog.close();
      }}
    />
  );
}