import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";
import { ToastProvider } from "./providers/toast";
import { KeyboardProvider } from "./providers/kebboard";
import { DialogProvider } from "./providers/dialog";
import { ThemeProvider, useTheme } from "./providers/theme";

function App() {
  const { theme } = useTheme();
  return (
    <KeyboardProvider>
      <DialogProvider>
        <ToastProvider>
          <box
            alignItems="center"
            justifyContent="center"
            backgroundColor={theme.colors.background}
            width="100%"
            height="100%"
            gap={2}
          >
            <Header />
            <box width="100%" maxWidth={78} paddingX={2}>
              <InputBar onSubmit={() => {}} />
            </box>
          </box>
        </ToastProvider>
      </DialogProvider>
    </KeyboardProvider>
  );
}

function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

const renderer = await createCliRenderer({
  targetFps: 60,
  exitOnCtrlC: false,
});
createRoot(renderer).render(<Root />);
