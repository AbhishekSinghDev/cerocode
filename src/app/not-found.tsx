"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconArrowLeft, IconHome, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20 px-4">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 -z-10 h-96 w-96 rounded-full bg-[#FF6B6B]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-[#06B6D4]/20 blur-3xl" />

      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <h2
            className={`text-9xl font-bold text-[#FF6B6B] transition-all ${
              glitch ? "animate-glitch" : ""
            }`}
          >
            404
          </h2>
        </div>

        {/* Badge */}
        <Badge
          variant="outline"
          className="mb-6 border-[#FF6B6B]/50 bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B]/20"
        >
          Error: Page Not Found
        </Badge>

        {/* Headline */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Oops! Lost in Space
        </h1>

        {/* Description */}
        <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
          The page you're looking for doesn't exist or has been moved to another
          location. Let's get you back on track.
        </p>

        {/* Code-style error card */}
        <Card className="mx-auto mb-8 max-w-xl overflow-hidden border-2 border-border/50 bg-card/50 backdrop-blur">
          <div className="border-b bg-muted/50 px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-muted-foreground">
                error.log
              </span>
            </div>
          </div>
          <div className="p-6">
            <pre className="text-left">
              <code className="font-mono text-sm leading-relaxed">
                <span className="text-muted-foreground">
                  $ cero navigate /this-page
                </span>
                {"\n\n"}
                <span className="text-[#FF6B6B]">Error:</span> Route not found
                {"\n"}
                <span className="text-muted-foreground">at</span> Navigator.find
                (routes.ts:42)
                {"\n"}
                <span className="text-muted-foreground">at</span> Router.resolve
                (index.ts:128)
                {"\n\n"}
                <span className="text-[#06B6D4]">
                  💡 Tip: Try checking the URL or return home
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
              <IconHome className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base sm:text-lg"
            asChild
          >
            <Link href="/#">
              <IconSearch className="mr-2 h-5 w-5" />
              Search Site
            </Link>
          </Button>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Button variant="ghost" asChild>
            <Link href="javascript:history.back()">
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
