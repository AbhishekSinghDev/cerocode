import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { RootLayout } from "./layouts/root-layout";

const renderer = await createCliRenderer({
  targetFps: 60,
  exitOnCtrlC: false,
});
createRoot(renderer).render(<RootLayout />);
