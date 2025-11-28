import { useTheme } from "@tui/hooks/use-theme";
import { useUI } from "@tui/hooks/use-ui";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";

export function ChatArea() {
  const { layout } = useUI();
  const { colors } = useTheme();

  return (
    <box
      style={{
        width: layout.chatWidth,
        height: layout.height,
        backgroundColor: colors.bg1,
        flexDirection: "column",
      }}
    >
      <MessageList />

      {/* Divider */}
      <box />

      <ChatInput />
    </box>
  );
}
