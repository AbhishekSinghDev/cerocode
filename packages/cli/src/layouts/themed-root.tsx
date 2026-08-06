import { useTheme } from "../providers/theme";

type ThemedRootProps = {
  children: React.ReactNode;
};

export function ThemedRoot(props: ThemedRootProps) {
  const { theme } = useTheme();

  return (
    <box
      backgroundColor={theme.colors.background}
      width="100%"
      height="100%"
    >
      {props.children}
    </box>
  );
}
