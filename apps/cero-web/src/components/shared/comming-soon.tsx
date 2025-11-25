"use client";

import { IconArrowLeft, IconBell, IconTerminal2 } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export default function CommingSoon() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : `${prev}.`));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Grid background */}
      <div className="absolute inset-0 grid-lines" />

      <div className="relative z-10 mx-auto max-w-md text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        {/* Terminal-style status */}
        <div className="mb-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-left font-mono">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <IconTerminal2 className="h-4 w-4 text-[#00ff41]" />
            <span>status</span>
          </div>
          <pre className="text-sm leading-relaxed">
            <code>
              <span className="text-muted-foreground">$ cero status</span>
              {"\n\n"}
              <span className="text-[#00d4ff]">Status:</span>{" "}
              <span className="text-foreground">In Development</span>
              {"\n"}
              <span className="text-[#00d4ff]">Progress:</span>{" "}
              <span className="text-[#00ff41]">████████░░</span> 80%
              {"\n"}
              <span className="text-[#00d4ff]">ETA:</span>{" "}
              <span className="text-[#ffb700]">Soon™</span>
            </code>
          </pre>
        </div>

        {/* Headline */}
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Coming Soon{dots}
        </h1>

        <p className="mb-8 text-muted-foreground">
          We&apos;re working hard to bring you something amazing. This page is currently under
          development.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="w-full bg-[#00ff41] font-medium text-black hover:bg-[#00ff41]/90 sm:w-auto"
            asChild
          >
            <Link href="/">
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-white/10 hover:border-white/20 sm:w-auto"
            asChild
          >
            <a href="#notify">
              <IconBell className="mr-2 h-4 w-4" />
              Notify Me
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
