import { useTerminalDimensions } from "@opentui/react";
import { createContext, type ReactNode, useCallback, useMemo, useState } from "react";
import type {
  AIModel,
  FocusMode,
  LayoutDimensions,
  UIContextValue,
  UIState,
} from "../../types/tui.type";

export const AI_MODELS: AIModel[] = [
  { id: "gpt-4o", name: "GPT-4o", description: "Most capable", provider: "OpenAI" },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Fast & efficient",
    provider: "OpenAI",
  },
  {
    id: "claude-4-sonnet",
    name: "Claude 4 Sonnet",
    description: "Balanced",
    provider: "Anthropic",
  },
  {
    id: "claude-4-opus",
    name: "Claude 4 Opus",
    description: "Most intelligent",
    provider: "Anthropic",
  },
  { id: "gemini-3", name: "Gemini 3", description: "Multimodal", provider: "Google" },
];

export const UIContext = createContext<UIContextValue | null>(null);

interface UIProviderProps {
  children: ReactNode;
  isLoading?: boolean;
  isStreaming?: boolean;
}

export function UIProvider({
  children,
  isLoading = false,
  isStreaming = false,
}: UIProviderProps) {
  const { width, height } = useTerminalDimensions();

  const [state, setState] = useState<UIState>({
    sidebarCollapsed: false,
    focusedChatIndex: -1,
    inputFocused: true,
    selectedModel: "gpt-4o",
    modelSelectorOpen: false,
    focusMode: "chat",
  });

  // Layout calculations
  const layout = useMemo<LayoutDimensions>(() => {
    const sidebarWidth = state.sidebarCollapsed ? 4 : Math.max(25, Math.floor(width * 0.22));
    return {
      width,
      height,
      sidebarWidth,
      chatWidth: width - sidebarWidth,
    };
  }, [width, height, state.sidebarCollapsed]);

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  }, []);

  const toggleModelSelector = useCallback(() => {
    setState((prev) => ({ ...prev, modelSelectorOpen: !prev.modelSelectorOpen }));
  }, []);

  const setSelectedModel = useCallback((modelId: string) => {
    setState((prev) => ({ ...prev, selectedModel: modelId, modelSelectorOpen: false }));
  }, []);

  const setFocusMode = useCallback((mode: FocusMode) => {
    setState((prev) => ({ ...prev, focusMode: mode }));
  }, []);

  const setInputFocused = useCallback((focused: boolean) => {
    setState((prev) => ({ ...prev, inputFocused: focused }));
  }, []);

  const setFocusedChatIndex = useCallback((index: number | ((prev: number) => number)) => {
    setState((prev) => ({
      ...prev,
      focusedChatIndex: typeof index === "function" ? index(prev.focusedChatIndex) : index,
    }));
  }, []);

  const focusChat = useCallback(() => {
    setState((prev) => ({ ...prev, focusMode: "chat", inputFocused: true }));
  }, []);

  const focusSidebar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      focusMode: "sidebar",
      inputFocused: false,
      focusedChatIndex: prev.focusedChatIndex === -1 ? 0 : prev.focusedChatIndex,
    }));
  }, []);

  const resetForNewChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      focusedChatIndex: -1,
      focusMode: "chat",
      inputFocused: true,
    }));
  }, []);

  const value = useMemo<UIContextValue>(
    () => ({
      ...state,
      layout,
      isInputDisabled: isLoading || isStreaming,
      toggleSidebar,
      toggleModelSelector,
      setSelectedModel,
      setFocusMode,
      setInputFocused,
      setFocusedChatIndex,
      focusChat,
      focusSidebar,
      resetForNewChat,
    }),
    [
      state,
      layout,
      isLoading,
      isStreaming,
      toggleSidebar,
      toggleModelSelector,
      setSelectedModel,
      setFocusMode,
      setInputFocused,
      setFocusedChatIndex,
      focusChat,
      focusSidebar,
      resetForNewChat,
    ]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
