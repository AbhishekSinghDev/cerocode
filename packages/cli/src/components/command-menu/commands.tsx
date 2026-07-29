import type { Command } from "./types";
import { ThemeDialogContent } from "../theme-dialog-content";

export const COMMANDS: Command[] = [
  {
    name: "new",
    description: "Start a new conversation",
    value: "/new",
    action: (ctx) => {
      ctx.toast.show({
        message: "Starting a new conversation...",
      });
    },
  },
  {
    name: "agents",
    description: "Switch between agents",
    value: "/agents",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Switch Agents",
        children: <text>Agent selection comming soon..</text>,
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
        children: <text>Model selection comming soon..</text>,
      });
    },
  },
  {
    name: "sessions",
    description: "View and manage your conversations",
    value: "/sessions",
    action: (ctx) => {
      ctx.toast.show({
        message: "Loading sessions...",
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
