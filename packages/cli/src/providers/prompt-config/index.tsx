import {
  DEFAULT_SUPPORTED_CHAT_MODEL,
  type SupportedChatModelId,
} from "@cerocode/shared";
import { createContext, useCallback, useContext, useState } from "react";

type Mode = "BUILD" | "PLAN";

type PromptConfigContextValue = {
  mode: Mode;
  toggleMode: () => void;
  setMode: (mode: Mode) => void;
  model: SupportedChatModelId;
  setModel: (model: SupportedChatModelId) => void;
};

const PromptConfigContext = createContext<PromptConfigContextValue | null>(
  null,
);

export function usePromptConfig(): PromptConfigContextValue {
  const value = useContext(PromptConfigContext);
  if (!value) {
    throw new Error(
      "usePromptConfig must be used within a PromptConfigProvider",
    );
  }
  return value;
}

type PromptConfigProviderProps = {
  children: React.ReactNode;
};

export function PromptConfigProvider({ children }: PromptConfigProviderProps) {
  const [mode, setMode] = useState<Mode>("BUILD");
  const [model, setModel] = useState<SupportedChatModelId>(
    DEFAULT_SUPPORTED_CHAT_MODEL,
  );

  const toogleMode = useCallback(() => {
    setMode((m) => (m === "BUILD" ? "PLAN" : "BUILD"));
  }, []);

  return (
    <PromptConfigContext.Provider
      value={{
        mode: mode,
        toggleMode: toogleMode,
        setMode: setMode,
        model: model,
        setModel: setModel,
      }}
    >
      {children}
    </PromptConfigContext.Provider>
  );
}
