"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HERO_BADGE_TEXT,
  HERO_HEADLINE,
  HERO_SUBHEADLINE,
} from "@/lib/constant";
import { IconBook, IconDownload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";

export function Hero() {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = `$ cero chat "explain async/await"

✨ Async/await is a way to write asynchronous code that looks synchronous.
It's built on top of Promises and makes async code easier to read.

Here's a simple example:

async function fetchUser() {
  const response = await fetch('/api/user');
  const data = await response.json();
  return data;
}

The 'await' keyword pauses execution until the Promise resolves!`;

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20 px-4 py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-6 border-[#FF6B6B]/50 bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B]/20"
          >
            {HERO_BADGE_TEXT}
          </Badge>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {HERO_HEADLINE} <span className="text-[#FF6B6B]">Developers</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-12 text-lg text-muted-foreground sm:text-xl md:text-2xl">
            {HERO_SUBHEADLINE}
          </p>

          {/* CTAs */}
          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-[#FF6B6B] text-base hover:bg-[#FF6B6B]/90 sm:text-lg"
              asChild
            >
              <a href="#install">
                Install Now
                <IconDownload className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base sm:text-lg"
              asChild
            >
              <a href="/docs">
                <IconBook className="mr-2 h-5 w-5" />
                View Documentation
              </a>
            </Button>
          </div>

          {/* Code Snippet Showcase */}
          <Card className="mx-auto py-0 max-w-3xl overflow-hidden border-2 border-border/50 bg-card/50 backdrop-blur">
            <div className="border-b bg-muted/50 px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-muted-foreground">
                  terminal
                </span>
              </div>
            </div>
            <div className="p-6">
              <pre className="overflow-x-auto text-left">
                <code className="text-sm font-mono leading-relaxed">
                  {displayedText}
                  <span className="animate-pulse">▊</span>
                </code>
              </pre>
            </div>
          </Card>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-0 -z-10 h-96 w-96 rounded-full bg-[#FF6B6B]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 -z-10 h-96 w-96 rounded-full bg-[#06B6D4]/20 blur-3xl" />
    </section>
  );
}
