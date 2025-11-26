import { useUser } from "../hooks/use-user"

interface UserInfoProps {
  collapsed?: boolean
}

export function UserInfo({ collapsed }: UserInfoProps) {
  const { user, isLoading, error, isAuthenticated } = useUser()

  if (collapsed) {
    return (
      <box style={{ paddingLeft: 1, paddingRight: 1 }}>
        <text fg={isAuthenticated ? "#00ff88" : "#ff4444"}>●</text>
      </box>
    )
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
          <text fg="#ffaa00">◌ </text>
          <text fg="#666666">Loading...</text>
        </box>
      </box>
    )
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
          <text fg="#ff4444">● </text>
          <text fg="#ff4444">Error</text>
        </box>
        <text fg="#555555">{error.length > 20 ? `${error.slice(0, 20)}...` : error}</text>
      </box>
    )
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
          <text fg="#ff4444">● </text>
          <text fg="#888888">Not logged in</text>
        </box>
        <text fg="#555555">Run 'cero login'</text>
      </box>
    )
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
        <text fg="#00ff88">● </text>
        <text fg="#ffffff">
          <strong>{user.name}</strong>
        </text>
      </box>
      <text fg="#555555">{user.email}</text>
    </box>
  )
}
