import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";

type Cmd = { value: string; description: string };

const GROUPS: { label: string; commands: Cmd[] }[] = [
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

export function CommandsSection() {
  return (
    <section className="border-t border-border py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            title="Type / for everything."
            description="Eight commands cover sessions, agents, models, themes, and auth. No flags to memorize."
          />
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {GROUPS.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.05}>
              <h3 className="font-mono text-xs tracking-wide text-muted-foreground">
                {group.label}
              </h3>
              <div className="mt-3 flex flex-col divide-y divide-border border-t border-border">
                {group.commands.map((cmd) => (
                  <div
                    key={cmd.value}
                    className="flex items-center gap-4 py-2.5 text-sm"
                  >
                    <span className="w-24 shrink-0 font-mono text-primary">
                      {cmd.value}
                    </span>
                    <span className="text-muted-foreground">
                      {cmd.description}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
