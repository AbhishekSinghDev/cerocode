import "opentui-spinner/react";
import { useTheme } from "../providers/theme";

type SpinnerProps = {
  mode?: "BUILD" | "PLAN";
};

export function Spinner({ mode }: SpinnerProps) {
  const { theme } = useTheme();
  const activeColor =
    mode === "PLAN" ? theme.colors.selection : theme.colors.primary;

  return <spinner name="aesthetic" color={activeColor} />;
}
