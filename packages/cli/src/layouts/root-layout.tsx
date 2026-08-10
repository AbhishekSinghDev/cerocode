import { Outlet } from "react-router";
import { DialogProvider } from "../providers/dialog";
import { KeyboardProvider } from "../providers/kebboard";
import { ThemeProvider } from "../providers/theme";
import { ToastProvider } from "../providers/toast";
import { ThemedRoot } from "./themed-root";
import { PromptConfigProvider } from "../providers/prompt-config";

export function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <KeyboardProvider>
          <DialogProvider>
            <PromptConfigProvider>
              <ThemedRoot>
                <Outlet />
              </ThemedRoot>
            </PromptConfigProvider>
          </DialogProvider>
        </KeyboardProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
