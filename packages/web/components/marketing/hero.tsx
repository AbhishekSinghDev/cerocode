"use client";

import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Container } from "./section";
import { TerminalPreview } from "./terminal-preview";
import { InstallCommand } from "./install-command";
import { GITHUB_URL } from "@/lib/constants";
import { EASE_OUT } from "@/lib/motion";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-14 pb-20 sm:pt-16 sm:pb-28"
    >
      <div
        className="bg-grid pointer-events-none absolute inset-0 z-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
        aria-hidden="true"
      />

      <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            An AI coding agent for your terminal.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Reads, edits, and runs commands in your project directory. Streams
            every response, and asks before it writes or executes anything.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <InstallCommand className="h-11" />
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              className="h-11 px-5 text-sm"
            >
              <HugeiconsIcon icon={GithubIcon} size={16} strokeWidth={1.5} />
              View on GitHub
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
        >
          <TerminalPreview />
        </motion.div>
      </Container>
    </section>
  );
}
