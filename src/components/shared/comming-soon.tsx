"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconArrowLeft, IconBell, IconRocket } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CommingSoon() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20 px-4">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 -z-10 h-96 w-96 rounded-full bg-[#FF6B6B]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-[#06B6D4]/20 blur-3xl" />

      <div className="mx-auto max-w-2xl text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-[#FF6B6B]/10 p-6">
            <IconRocket className="h-16 w-16 text-[#FF6B6B]" stroke={1.5} />
          </div>
        </div>

        {/* Badge */}
        <Badge
          variant="outline"
          className="mb-6 border-[#FF6B6B]/50 bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B]/20"
        >
          Under Construction
        </Badge>

        {/* Headline */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Comming Soon{dots}
        </h1>

        {/* Description */}
        <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
          We're working hard to bring you something amazing. This page is
          currently under development and will be available soon.
        </p>

        {/* Code-style card */}
        <Card className="mx-auto mb-8 max-w-xl overflow-hidden border-2 border-border/50 bg-card/50 backdrop-blur">
          <div className="border-b bg-muted/50 px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-muted-foreground">status</span>
            </div>
          </div>
          <div className="p-6">
            <pre className="text-left">
              <code className="font-mono text-sm leading-relaxed">
                <span className="text-muted-foreground">$ cero status</span>
                {"\n\n"}
                <span className="text-[#06B6D4]">Status:</span> In Development
                {"\n"}
                <span className="text-[#06B6D4]">Progress:</span> 75%
                {"\n"}
                <span className="text-[#06B6D4]">ETA:</span> Soon™
                {"\n\n"}
                <span className="text-[#FF6B6B]">
                  ⚡ Stay tuned for updates!
                </span>
              </code>
            </pre>
          </div>
        </Card>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-[#FF6B6B] text-base hover:bg-[#FF6B6B]/90 sm:text-lg"
            asChild
          >
            <Link href="/">
              <IconArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base sm:text-lg"
            asChild
          >
            <a href="#notify">
              <IconBell className="mr-2 h-5 w-5" />
              Notify Me
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
