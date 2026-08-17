"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Container } from "./section";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Modes", href: "#modes" },
  { label: "Tools", href: "#tools" },
  { label: "Models", href: "#models" },
  { label: "Architecture", href: "#architecture" },
];

const GITHUB_URL = "https://github.com/AbhishekSinghDev/cerocode";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center" aria-label="cerocode home">
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="cerocode on GitHub" />}
          >
            <HugeiconsIcon icon={GithubIcon} size={18} strokeWidth={1.5} />
          </Button>
          <Button
            variant="default"
            nativeButton={false}
            render={<a href="#install" />}
            className="h-9 px-4"
          >
            Get started
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center border border-border text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <HugeiconsIcon icon={open ? Cancel01Icon : Menu01Icon} size={18} strokeWidth={1.5} />
        </button>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-b border-border bg-background lg:hidden",
          open ? "max-h-96" : "max-h-0 border-b-0",
        )}
        style={{ transition: "max-height 0.3s ease" }}
      >
        <Container className="flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={<a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" />}
              className="h-9 flex-1"
            >
              <HugeiconsIcon icon={GithubIcon} size={16} strokeWidth={1.5} />
              GitHub
            </Button>
            <Button
              variant="default"
              nativeButton={false}
              render={<a href="#install" onClick={() => setOpen(false)} />}
              className="h-9 flex-1"
            >
              Get started
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
