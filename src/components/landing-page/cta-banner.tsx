"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { INSTALL_COMMAND } from "@/lib/constant";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";

export function CTABanner() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="install"
      className="relative overflow-hidden border-b px-4 py-20 md:py-32 backdrop-blur-sm"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-pink-900/20" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      {/* Animated Glowing orbs with glass effect */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 -z-10 h-96 w-96 rounded-full bg-gradient-to-br from-pink-500/40 to-red-500/20 blur-3xl opacity-60 animate-pulse" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/40 to-blue-500/20 blur-3xl opacity-60 animate-pulse" />
      <div className="pointer-events-none absolute -bottom-1/2 left-1/2 -z-10 h-96 w-96 rounded-full bg-gradient-to-tr from-purple-500/30 to-pink-500/10 blur-3xl opacity-50" />

      <div className="container relative mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          {/* Headline */}
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-accent dark:text-accent-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Ready to Supercharge Your{" "}
            <span className="text-[#FF6B6B]">Terminal?</span>
          </h2>

          <p className="mb-12 text-lg text-gray-300 md:text-xl">
            Join thousands of developers using AI to code faster and smarter
          </p>

          {/* Install Command */}
          <Card className="mb-8 overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <div className="bg-gradient-to-r from-white/5 to-white/0 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 overflow-x-auto">
                  <code className="text-lg font-mono text-white md:text-2xl">
                    <span className="text-pink-400">$</span> {INSTALL_COMMAND}
                  </code>
                </div>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={copyToClipboard}
                  className="shrink-0 text-white hover:bg-white/20 hover:text-white transition-all duration-200"
                >
                  {copied ? (
                    <>
                      <IconCheck className="mr-2 h-5 w-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <IconCopy className="mr-2 h-5 w-5" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-[#FF6B6B] text-lg hover:bg-[#FF6B6B]/90 min-w-[200px]"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/10 text-lg text-white hover:bg-white/20 hover:text-white min-w-[200px]"
              asChild
            >
              <a
                href="https://github.com/yourusername/cero"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-[#FF6B6B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Free Forever
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-[#FF6B6B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              No Credit Card
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-[#FF6B6B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Open Source
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
