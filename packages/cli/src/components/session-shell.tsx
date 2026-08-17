import { useMemo } from "react";
import { TextAttributes } from "@opentui/core";
import { InputBar } from "./input-bar";
import { FooterBar, type FooterHint } from "./footer-bar";
import { usePromptConfig } from "../providers/prompt-config";
import { useTheme } from "../providers/theme";
import { getGitBranch } from "../lib/git";
import { GLYPH } from "./ui/glyphs";

const DEFAULT_HINTS: FooterHint[] = [{ keyLabel: "tab", label: "agent" }];

type Props = {
  children?: React.ReactNode;
  onSubmit: (text: string) => void;
  onNewSession: () => void;
  onOpenSession: (id: string) => void;
  inputDisabled?: boolean;
  loading?: boolean;
  interruptible?: boolean;
  totalTokens?: number;
  hints?: FooterHint[];
};

export function SessionShell(props: Props) {
  const { mode, model } = usePromptConfig();
  const { theme } = useTheme();

  const location = useMemo(() => {
    const cwd = process.cwd();
    const branch = getGitBranch(cwd);
    return branch ? `${cwd}:${branch}` : cwd;
  }, []);

  return (
    <box
      flexDirection="column"
      flexGrow={1}
      width="100%"
      height="100%"
      paddingY={1}
      paddingX={2}
      gap={1}
    >
      <box
        flexDirection="row"
        alignItems="center"
        gap={1}
        height={1}
        flexShrink={0}
      >
        <text fg={theme.colors.primary}>{GLYPH.brand}</text>
        <text attributes={TextAttributes.BOLD} fg={theme.colors.text}>
          cerocode
        </text>
      </box>

      <scrollbox flexGrow={1} width="100%" stickyScroll stickyStart="bottom">
        <box>{props.children}</box>
      </scrollbox>

      <box flexShrink={0}>
        <InputBar
          onSubmit={props.onSubmit}
          onNewSession={props.onNewSession}
          onOpenSession={props.onOpenSession}
          disabled={props.inputDisabled}
        />
      </box>

      <FooterBar
        mode={mode}
        model={model}
        totalTokens={props.totalTokens}
        loading={props.loading}
        interruptible={props.interruptible}
        cwd={location}
        hints={props.hints ?? DEFAULT_HINTS}
      />
    </box>
  );
}
