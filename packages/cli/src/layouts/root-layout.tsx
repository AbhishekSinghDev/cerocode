import { DialogProvider } from "../providers/dialog";
import { KeyboardProvider } from "../providers/kebboard";
import { ThemeProvider } from "../providers/theme";
import { ToastProvider } from "../providers/toast";
import { ThemedRoot } from "./themed-root";
import { PromptConfigProvider } from "../providers/prompt-config";
import { ChatScreen } from "../screens/chat-screen";

export function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <KeyboardProvider>
          <DialogProvider>
            <PromptConfigProvider>
              <ThemedRoot>
                <ChatScreen />
              </ThemedRoot>
            </PromptConfigProvider>
          </DialogProvider>
        </KeyboardProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
