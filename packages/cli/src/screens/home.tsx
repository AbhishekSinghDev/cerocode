import { useCallback } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/header";
import { InputBar } from "../components/input-bar";
import { usePromptConfig } from "../providers/prompt-config";
import { useTheme } from "../providers/theme";
import { TextAttributes } from "@opentui/core";

export function HomeScreen() {
  const navigate = useNavigate();
  const { mode, model } = usePromptConfig();
  const { theme } = useTheme();

  const handleSubmit = useCallback(
    (text: string) => {
      navigate("/sessions/new", { state: { message: text, mode, model } });
    },
    [navigate, mode, model],
  );

  return (
    <box
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={2}
      position="relative"
      width="100%"
      height="100%"
    >
      <Header />
      <box
        width="100%"
        maxWidth={78}
        paddingX={2}
        flexDirection="column"
        gap={1}
      >
        <InputBar onSubmit={handleSubmit} />
        <box flexDirection="row" gap={1} flexShrink={0} marginLeft="auto">
          <text fg={theme.colors.textMuted}>tab</text>
          <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>agents</text>
        </box>
      </box>
    </box>
  );
}
