// Lightweight smoke test for the TUI redesign — headless render, no backend
// required. Run with `bun test src/__visual-check.test.tsx`.
import { test, afterEach } from "bun:test";
import { testRender } from "@opentui/react/test-utils";
import { ThemeProvider } from "./providers/theme";
import { ToastProvider } from "./providers/toast";
import { KeyboardProvider } from "./providers/kebboard";
import { DialogProvider } from "./providers/dialog";
import { PromptConfigProvider } from "./providers/prompt-config";
import { ChatScreen } from "./screens/chat-screen";

let testSetup: Awaited<ReturnType<typeof testRender>>;

afterEach(() => {
  testSetup?.renderer.destroy();
});

test("chat screen renders its empty state", async () => {
  testSetup = await testRender(
    <ThemeProvider>
      <ToastProvider>
        <KeyboardProvider>
          <DialogProvider>
            <PromptConfigProvider>
              <ChatScreen />
            </PromptConfigProvider>
          </DialogProvider>
        </KeyboardProvider>
      </ToastProvider>
    </ThemeProvider>,
    { width: 100, height: 32 },
  );
  await testSetup.renderOnce();
  await testSetup.waitForVisualIdle();
  console.log(testSetup.captureCharFrame());
});
