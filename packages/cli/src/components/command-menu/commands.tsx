import type { Command } from "./types";
import { ThemeDialogContent } from "../theme-dialog-content";
import { SessionDialogContent } from "../dialogs/sessions-dialog";
import { AgentsDialog } from "../dialogs/agents-dialog";
import { ModelsDialog } from "../dialogs/models-dialog";
import { SUPPORTED_CHAT_MODELS } from "@cerocode/shared";

export const COMMANDS: Command[] = [
  {
    name: "new",
    description: "Start a new conversation",
    value: "/new",
    action: (ctx) => {
      ctx.navigate("/");
    },
  },
  {
    name: "agents",
    description: "Switch between agents",
    value: "/agents",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Switch Agents",
        children: (
          <AgentsDialog currentMode={ctx.mode} onSelectMode={ctx.setMode} />
        ),
      });
    },
  },
  {
    name: "models",
    description: "View and change the current model",
    value: "/models",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select Model",
        children: (
          <ModelsDialog
            models={SUPPORTED_CHAT_MODELS.map((model) => model.id)}
            onSelectModel={ctx.setModel}
          />
        ),
      });
    },
  },
  {
    name: "sessions",
    description: "View and manage your conversations",
    value: "/sessions",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select Theme",
        children: <SessionDialogContent />,
      });
    },
  },
  {
    name: "theme",
    description: "Change the application theme",
    value: "/theme",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select Theme",
        children: <ThemeDialogContent />,
      });
    },
  },
  {
    name: "login",
    description: "Sign in to your browser",
    value: "/login",
    action: (ctx) => {
      ctx.toast.show({
        message: "Opening browser to sign in...",
      });
    },
  },
  {
    name: "logout",
    description: "Sign out of your account",
    value: "/logout",
    action: (ctx) => {
      ctx.toast.show({
        message: "Signing out...",
      });
    },
  },
  {
    name: "upgrade",
    description: "Buy more credits",
    value: "/upgrade",
    action: (ctx) => {
      ctx.toast.show({
        message: "Opening upgrade page...",
      });
    },
  },
  {
    name: "usage",
    description: "Open billing portal in your browser",
    value: "/usage",
    action: (ctx) => {
      ctx.toast.show({
        message: "Opening billing portal...",
      });
    },
  },
  {
    name: "exit",
    description: "Quit the application",
    value: "/exit",
    action: (ctx) => {
      ctx.exit();
    },
  },
];
