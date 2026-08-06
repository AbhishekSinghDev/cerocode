import { useTheme } from "../../providers/theme";

type Props = {
  message: string;
};

export function UserMessage({ message }: Props) {
  const { theme } = useTheme();

  return (
    <box width="100%" alignItems="center">
      <box border={["left"]} borderColor={theme.colors.primary} width="100%">
        <box
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor={theme.colors.surface}
          width="100%"
        >
          <text fg={theme.colors.text}>{message}</text>
        </box>
      </box>
    </box>
  );
}
