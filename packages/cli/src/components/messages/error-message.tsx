import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";
import { GLYPH } from "../ui/glyphs";
import { tint } from "../ui/tint";

type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props) {
  const { theme } = useTheme();

  return (
    <box width="100%" flexDirection="column" paddingTop={1}>
      <box
        width="100%"
        flexDirection="column"
        gap={1}
        backgroundColor={tint(theme.colors.error, 0.16)}
        border={["left"]}
        borderColor={theme.colors.error}
        paddingX={2}
        paddingY={1}
      >
        <text attributes={TextAttributes.BOLD} fg={theme.colors.error}>
          {GLYPH.error} error
        </text>
        <text fg={theme.colors.text} wrapMode="word" width="100%">
          {message}
        </text>
      </box>
    </box>
  );
}
