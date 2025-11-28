import { useChat } from "@tui/hooks/use-chat";
import { useTheme } from "@tui/hooks/use-theme";
import { useUI } from "@tui/hooks/use-ui";
import { AI_MODELS } from "../context/ui-context";

function ModelSelector() {
  const { selectedModel } = useUI();
  const { colors } = useTheme();

  return (
    <box
      style={{
        flexDirection: "column",
        backgroundColor: colors.bg2,
        border: true,
        borderStyle: "rounded",
        borderColor: colors.border1,
        marginLeft: 1,
        marginRight: 1,
      }}
    >
      <box style={{ paddingLeft: 1 }}>
        <text fg={colors.fg4}>Select Model (1-5):</text>
      </box>
      {AI_MODELS.map((model, idx) => {
        const isSelected = model.id === selectedModel;
        return (
          <box key={model.id} style={{ paddingLeft: 1, flexDirection: "row" }}>
            <text fg={colors.fg5}>{idx + 1}. </text>
            <text fg={isSelected ? colors.primary : colors.fg3}>
              {isSelected ? "● " : "○ "}
            </text>
            <text fg={isSelected ? colors.primary : colors.fg1}>{model.name}</text>
            <text fg={colors.fg5}> [{model.provider}]</text>
          </box>
        );
      })}
    </box>
  );
}

export function ChatInput() {
  const { selectedModel, modelSelectorOpen, inputFocused, isInputDisabled } = useUI();
  const { sendMessage } = useChat();
  const { colors } = useTheme();

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel) ?? AI_MODELS[0];

  const handleSubmit = (value: string) => {
    if (!isInputDisabled && value.trim()) {
      sendMessage(value);
    }
  };

  return (
    <box
      style={{
        flexDirection: "column",
        backgroundColor: colors.bg2,
      }}
    >
      {/* Model selector dropdown */}
      {modelSelectorOpen && <ModelSelector />}

      {/* Model info row */}
      <box style={{ paddingLeft: 1, paddingRight: 1, flexDirection: "row" }}>
        <text fg={colors.fg5}>⚡</text>
        <text fg={colors.primary}> {currentModel?.name}</text>
        <text fg={colors.border1}> • </text>
        <text fg={colors.fg5}>[m] change model</text>
        {isInputDisabled && (
          <>
            <text fg={colors.border1}> • </text>
            <text fg={colors.warning}>⏳ Generating...</text>
          </>
        )}
      </box>

      {/* Input field */}
      <box
        style={{
          height: 3,
          marginLeft: 1,
          marginRight: 1,
          marginBottom: 1,
          border: true,
          borderStyle: inputFocused && !isInputDisabled ? "double" : "single",
          borderColor: isInputDisabled
            ? colors.border1
            : inputFocused
              ? colors.border3
              : colors.border1,
          backgroundColor: isInputDisabled ? colors.bg1 : colors.bg3,
          maxHeight: 10,
        }}
      >
        <input
          placeholder={
            isInputDisabled ? "Waiting for response..." : "Type a message… (Enter to send)"
          }
          focused={inputFocused && !isInputDisabled}
          onSubmit={handleSubmit}
        />
      </box>
    </box>
  );
}
