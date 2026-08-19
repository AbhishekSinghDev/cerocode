import { HugeiconsIcon } from "@hugeicons/react";
import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";
import { TechLogo } from "./tech-logo";
import { PACKAGES } from "@/lib/data/architecture";
import { TERMINAL_SLATE_HEX } from "@/lib/theme";

export function ArchitectureSection() {
  return (
    <section id="architecture" className="border-t border-border py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            title="Four packages, one Bun monorepo."
            description="The CLI, API server, shared contracts, and database schema live side by side and ship independently."
          />
        </Reveal>

        <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((pkg, i) => (
            <Reveal key={pkg.name} delay={i * 0.06}>
              <div
                className="flex h-full flex-col gap-3 bg-card p-6"
                style={
                  i % 2 === 0
                    ? {
                        backgroundImage:
                          "radial-gradient(circle at 100% 0%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 60%)",
                      }
                    : undefined
                }
              >
                <HugeiconsIcon
                  icon={pkg.icon}
                  size={20}
                  strokeWidth={1.5}
                  className="text-primary"
                />
                <div>
                  <p className="font-mono text-sm text-foreground">{pkg.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {pkg.path}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {pkg.description}
                </p>
                <ul className="space-y-1 border-t border-border pt-3 font-mono text-[11px] leading-relaxed text-muted-foreground/80">
                  {pkg.facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center gap-3 pt-3">
                  {pkg.stack.map((tech) => (
                    <TechLogo
                      key={tech.slug}
                      slug={tech.slug}
                      label={tech.label}
                      color={TERMINAL_SLATE_HEX}
                      size={16}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-8">
          <div className="border border-border bg-card">
            <div className="flex h-9 items-center gap-2 border-b border-border px-4">
              <span className="size-2 bg-muted-foreground/40" aria-hidden="true" />
              <span className="font-mono text-[11px] text-muted-foreground">
                packages/cli/src/lib/local-tools.ts
              </span>
            </div>
            <div className="space-y-1 overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-6 whitespace-pre text-muted-foreground sm:text-[13px]">
              <p>
                <span className="text-primary">resolveCwd</span>(path)
              </p>
              <p>
                {"  "}resolve(cwd, path){"  "}
                <span className="text-muted-foreground/60">
                  # collapse .. and .
                </span>
              </p>
              <p>
                {"  "}reject if the result escapes cwd
              </p>
              <p>
                {"  "}realpath() both sides{"  "}
                <span className="text-muted-foreground/60"># follow symlinks</span>
              </p>
              <p>
                {"  "}reject if the real path escapes the real cwd
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-[60ch] text-sm text-muted-foreground">
            Every read, write, and edit resolves through this before it
            touches disk. A symlink pointing outside the project doesn't get
            you outside the project.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
