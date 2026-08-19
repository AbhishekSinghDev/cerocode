export type Cmd = { value: string; description: string };

export const GROUPS: { label: string; commands: Cmd[] }[] = [
  {
    label: "Session",
    commands: [
      { value: "/new", description: "Start a new conversation" },
      { value: "/sessions", description: "View and manage your conversations" },
    ],
  },
  {
    label: "Agent",
    commands: [
      { value: "/agents", description: "Switch between BUILD and PLAN" },
      { value: "/models", description: "View and change the current model" },
      { value: "/theme", description: "Change the application theme" },
    ],
  },
  {
    label: "Account",
    commands: [
      { value: "/login", description: "Sign in through your browser" },
      { value: "/logout", description: "Sign out of your account" },
    ],
  },
  {
    label: "App",
    commands: [{ value: "/exit", description: "Quit the application" }],
  },
];