import type { AIModel } from "../../types/tui.type"

interface ModelSelectorProps {
  models: AIModel[]
  selectedModel: string
  onSelect: (modelId: string) => void
  expanded: boolean
  onToggle: () => void
}

export function ModelSelector({ models, selectedModel }: ModelSelectorProps) {
  return (
    <box
      style={{
        flexDirection: "column",
        backgroundColor: "#0a0a0a",
        border: true,
        borderStyle: "single",
        borderColor: "#333333",
        marginLeft: 1,
        marginRight: 1,
      }}
    >
      <box style={{ paddingLeft: 1 }}>
        <text fg="#666666">Select Model (1-5):</text>
      </box>
      {models.map((model, idx) => {
        const isSelected = model.id === selectedModel
        return (
          <box key={model.id} style={{ paddingLeft: 1, flexDirection: "row" }}>
            <text fg="#444444">{idx + 1}. </text>
            <text fg={isSelected ? "#00ff88" : "#888888"}>{isSelected ? "● " : "○ "}</text>
            <text fg={isSelected ? "#00ff88" : "#ffffff"}>{model.name}</text>
            <text fg="#444444"> [{model.provider}]</text>
          </box>
        )
      })}
    </box>
  )
}

interface ChatInputProps {
  models: AIModel[]
  selectedModel: string
  onModelSelect: (modelId: string) => void
  modelSelectorOpen: boolean
  onToggleModelSelector: () => void
  onInputChange: (value: string) => void
  onSubmit: (value: string) => void
  focused: boolean
  disabled?: boolean
}

export function ChatInput({
  models,
  selectedModel,
  modelSelectorOpen,
  onInputChange,
  onSubmit,
  focused,
  disabled = false,
}: ChatInputProps) {
  const current = models.find((m) => m.id === selectedModel) ?? models[0]

  const handleSubmit = (value: string) => {
    if (!disabled) {
      onSubmit(value)
    }
  }

  return (
    <box
      style={{
        flexDirection: "column",
        backgroundColor: "#0a0a0a",
      }}
    >
      {/* Model selector dropdown */}
      {modelSelectorOpen && (
        <ModelSelector
          models={models}
          selectedModel={selectedModel}
          onSelect={() => {}}
          expanded={modelSelectorOpen}
          onToggle={() => {}}
        />
      )}

      {/* Model info row */}
      <box style={{ paddingLeft: 1, paddingRight: 1, flexDirection: "row" }}>
        <text fg="#444444">⚡</text>
        <text fg="#00ff88"> {current?.name}</text>
        <text fg="#333333"> • </text>
        <text fg="#444444">[m] change model</text>
        {disabled && (
          <>
            <text fg="#333333"> • </text>
            <text fg="#ffaa00">⏳ Generating...</text>
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
          borderStyle: focused && !disabled ? "double" : "single",
          borderColor: disabled ? "#333333" : focused ? "#00ff88" : "#222222",
          backgroundColor: disabled ? "#050505" : "#0f0f0f",
        }}
      >
        <input
          placeholder={disabled ? "Waiting for response..." : "Type a message… (Enter to send)"}
          focused={focused && !disabled}
          onInput={onInputChange}
          onSubmit={handleSubmit}
        />
      </box>
    </box>
  )
}
