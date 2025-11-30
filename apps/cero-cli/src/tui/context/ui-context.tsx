import { DEFAULT_AI_MODEL_ID } from "@cerocode/constants";
import { useTerminalDimensions } from "@opentui/react";
import { createContext, type ReactNode, useCallback, useMemo, useState } from "react";
import type {
  FocusMode,
  LayoutDimensions,
  SupportedAIModelId,
  SupportedAIToolId,
  UIContextValue,
  UIState,
} from "../../types/tui.type";

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
    selectedModel: DEFAULT_AI_MODEL_ID,
    selectedTools: [],
    modelSelectorOpen: false,
    toolSelectorOpen: false,
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
    setState((prev) => ({
      ...prev,
      modelSelectorOpen: !prev.modelSelectorOpen,
      toolSelectorOpen: false, // Close tool selector when opening model selector
    }));
  }, []);

  const toggleToolSelector = useCallback(() => {
    setState((prev) => ({
      ...prev,
      toolSelectorOpen: !prev.toolSelectorOpen,
      modelSelectorOpen: false, // Close model selector when opening tool selector
    }));
  }, []);

  const setSelectedModel = useCallback((modelId: SupportedAIModelId) => {
    setState((prev) => ({ ...prev, selectedModel: modelId, modelSelectorOpen: false }));
  }, []);

  const toggleTool = useCallback((toolId: SupportedAIToolId) => {
    setState((prev) => {
      const isSelected = prev.selectedTools.includes(toolId);
      const newTools = isSelected
        ? prev.selectedTools.filter((id) => id !== toolId)
        : [...prev.selectedTools, toolId];
      return { ...prev, selectedTools: newTools };
    });
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
      toggleToolSelector,
      setSelectedModel,
      toggleTool,
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
      toggleToolSelector,
      setSelectedModel,
      toggleTool,
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
