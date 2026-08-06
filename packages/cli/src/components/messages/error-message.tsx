import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";

type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props) {
  const { theme } = useTheme();

  return (
    <box width="100%" alignItems="center">
      <box border={["left"]} borderColor={theme.colors.error} width="100%">
        <box
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor={theme.colors.surface}
          width="100%"
        >
          <text attributes={TextAttributes.DIM} fg={theme.colors.error}>
            {message}
          </text>
        </box>
      </box>
    </box>
  );
}
