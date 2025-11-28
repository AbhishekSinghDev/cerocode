import { useAuth } from "@tui/hooks/use-auth";
import { useTheme } from "@tui/hooks/use-theme";

interface UserInfoProps {
  collapsed?: boolean;
}

export function UserInfo({ collapsed }: UserInfoProps) {
  const { user, isLoading, isAuthenticated, error } = useAuth();
  const { colors } = useTheme();

  if (collapsed) {
    return (
      <box style={{ paddingLeft: 1, paddingRight: 1 }}>
        <text fg={isAuthenticated ? colors.success : colors.error}>●</text>
      </box>
    );
  }

  if (isLoading) {
    return (
      <box
        style={{
          flexDirection: "column",
          paddingLeft: 1,
          paddingRight: 1,
        }}
      >
        <box style={{ flexDirection: "row", alignItems: "center" }}>
          <text fg={colors.warning}>◌ </text>
          <text fg={colors.fg4}>Loading...</text>
        </box>
      </box>
    );
  }

  if (error) {
    return (
      <box
        style={{
          flexDirection: "column",
          paddingLeft: 1,
          paddingRight: 1,
        }}
      >
        <box style={{ flexDirection: "row", alignItems: "center" }}>
          <text fg={colors.error}>● </text>
          <text fg={colors.error}>Error</text>
        </box>
        <text fg={colors.fg5}>{error.length > 20 ? `${error.slice(0, 20)}...` : error}</text>
      </box>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <box
        style={{
          flexDirection: "column",
          paddingLeft: 1,
          paddingRight: 1,
        }}
      >
        <box style={{ flexDirection: "row", alignItems: "center" }}>
          <text fg={colors.error}>● </text>
          <text fg={colors.fg4}>Not logged in</text>
        </box>
        <text fg={colors.fg5}>Run 'cero login'</text>
      </box>
    );
  }

  return (
    <box
      style={{
        flexDirection: "column",
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      <box style={{ flexDirection: "row", alignItems: "center" }}>
        <text fg={colors.success}>● </text>
        <text fg={colors.fg1}>
          <strong>{user.name}</strong>
        </text>
      </box>
      <text fg={colors.fg5}>{user.email}</text>
    </box>
  );
}
