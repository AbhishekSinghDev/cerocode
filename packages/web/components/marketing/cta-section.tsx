import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, GithubIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Container } from "./section";
import { Reveal } from "./reveal";
import { InstallCommand } from "./install-command";

const GITHUB_URL = "https://github.com/AbhishekSinghDev/cerocode";

export function CtaSection() {
  return (
    <section className="border-t border-border py-24 sm:py-32">
      <Container className="max-w-2xl text-center">
        <Reveal>
          <h2 className="text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Open source. MIT licensed. Yours to run.
          </h2>
          <p className="mx-auto mt-4 max-w-[50ch] text-base leading-relaxed text-muted-foreground">
            Clone it, self-host the server, or install the published CLI and
            point it at your own instance.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="default"
              nativeButton={false}
              render={<a href="#install" />}
              className="h-11 px-5 text-sm"
            >
              Get started
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={1.5} />
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" />
              }
              className="h-11 px-5 text-sm"
            >
              <HugeiconsIcon icon={GithubIcon} size={16} strokeWidth={1.5} />
              View on GitHub
            </Button>
          </div>

          <div className="mt-8 flex justify-center">
            <InstallCommand />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
