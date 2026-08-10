import { useCallback } from "react";
import { useDialog } from "../../providers/dialog";
import { useTheme } from "../../providers/theme";
import { DialogSearchList } from "../dialog-search-list";
import type { SupportedChatModelId } from "@cerocode/shared";

type ModelsDialogProps = {
  models: SupportedChatModelId[];
  onSelectModel: (model: SupportedChatModelId) => void;
};

export const ModelsDialog = ({ models, onSelectModel }: ModelsDialogProps) => {
  const dialog = useDialog();
  const { theme } = useTheme();

  const handleSelect = useCallback(
    (modelId: SupportedChatModelId) => {
      onSelectModel(modelId);
      dialog.close();
    },
    [onSelectModel, dialog],
  );

  return (
    <DialogSearchList
      items={models}
      onSelect={handleSelect}
      filterFn={(modelId, query) =>
        modelId.toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(modelId, isSelected) => (
        <text selectable={false} fg={isSelected ? theme.colors.textOnSelection : theme.colors.text}>
          {modelId}
        </text>
      )}
      getKey={(modelId) => modelId}
      placeholder="Search models..."
      emptyText="No matching models found"
    />
  );
};
