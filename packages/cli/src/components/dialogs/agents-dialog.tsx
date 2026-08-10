import { useCallback } from "react";
import { useDialog } from "../../providers/dialog";
import { DialogSearchList } from "../dialog-search-list";

type AgentsDialogProps = {
  currentMode: "BUILD" | "PLAN";
  onSelectMode: (mode: "BUILD" | "PLAN") => void;
};

function getModelLabel(mode: "BUILD" | "PLAN") {
  switch (mode) {
    case "BUILD":
      return "Build";
    case "PLAN":
      return "Plan";
  }
}

const AVAILABLE_MODES: ("BUILD" | "PLAN")[] = ["BUILD", "PLAN"];

export const AgentsDialog = ({
  currentMode,
  onSelectMode,
}: AgentsDialogProps) => {
  const dialog = useDialog();

  const handleSelect = useCallback(
    (nextMode: "BUILD" | "PLAN") => {
      onSelectMode(nextMode);
      dialog.close();
    },
    [onSelectMode, dialog],
  );

  return (
    <DialogSearchList
      items={AVAILABLE_MODES}
      onSelect={handleSelect}
      filterFn={(item, query) =>
        getModelLabel(item).toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(item, isSelected) => (
        <text selectable={false} fg={isSelected ? "black" : "white"}>
          {getModelLabel(item)}
        </text>
      )}
      getKey={(item) => item}
      placeholder="Search agents..."
      emptyText="No matching agents found"
    />
  );
};
