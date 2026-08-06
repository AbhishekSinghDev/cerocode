import { Outlet } from "react-router";
import { DialogProvider } from "../providers/dialog";
import { KeyboardProvider } from "../providers/kebboard";
import { ThemeProvider } from "../providers/theme";
import { ToastProvider } from "../providers/toast";
import { ThemedRoot } from "./themed-root";

export function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <KeyboardProvider>
          <DialogProvider>
            <ThemedRoot>
              <Outlet />
            </ThemedRoot>
          </DialogProvider>
        </KeyboardProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
