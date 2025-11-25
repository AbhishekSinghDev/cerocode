"use client";

import { Button } from "@/components/ui/button";
import { HERO, INSTALL_COMMAND } from "@/lib/constant";
import {
  IconArrowRight,
  IconBrandGithub,
  IconCheck,
  IconTerminal2,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// Device Flow Animation States
type FlowState = "idle" | "typing" | "browser" | "connecting" | "success";

export function Hero() {
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [terminalText, setTerminalText] = useState("");
  const [copied, setCopied] = useState(false);

  // Device flow animation sequence
  const terminalCommand = "$ cero login";

  useEffect(() => {
    const sequence = async () => {
      await new Promise((r) => setTimeout(r, 1000));
      setFlowState("typing");

      for (let i = 0; i <= terminalCommand.length; i++) {
        setTerminalText(terminalCommand.slice(0, i));
        await new Promise((r) => setTimeout(r, 80));
      }

      await new Promise((r) => setTimeout(r, 500));
      setFlowState("browser");

      await new Promise((r) => setTimeout(r, 800));
      setFlowState("connecting");

      await new Promise((r) => setTimeout(r, 1000));
      setFlowState("success");

      await new Promise((r) => setTimeout(r, 3000));
      setTerminalText("");
      setFlowState("idle");
    };

    sequence();
    const interval = setInterval(sequence, 10000);
    return () => clearInterval(interval);
  }, []);

  const copyCommand = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-[90vh] border-line">
      {/* Grid background */}
      <div className="absolute inset-0 grid-lines" />

      <div className="container mx-auto px-4 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/20 text-[#00ff41] text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
              {HERO.badge}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              <span className="text-foreground">AI coding agent</span>
              <br />
              <span className="text-[#00ff41]">for terminal.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground max-w-lg">
              {HERO.subheadline}
              <span className="text-[#00ff41]"> {HERO.highlight}</span>
            </p>

            {/* Install Command */}
            <button
              type="button"
              onClick={copyCommand}
              className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-[#00ff41]/30 transition-all duration-300"
            >
              <IconTerminal2 className="w-4 h-4 text-[#00ff41]" />
              <code className="font-mono text-sm text-[#00ff41]">{INSTALL_COMMAND}</code>
              <span className="ml-auto px-2 py-0.5 rounded text-xs bg-white/5 text-muted-foreground group-hover:bg-[#00ff41]/10 group-hover:text-[#00ff41] transition-colors">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                className="bg-[#00ff41] text-black font-medium hover:bg-[#00ff41]/90 transition-all duration-300"
                asChild
              >
                <Link href="/docs">
                  Get Started
                  <IconArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 hover:border-white/20"
                asChild
              >
                <Link
                  href="https://github.com/AbhishekSinghDev/cerocode"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandGithub className="mr-2 w-4 h-4" />
                  GitHub
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
              {HERO.platforms.map((platform) => (
                <div key={platform} className="flex items-center gap-1.5">
                  <span className="text-[#00ff41]">✓</span>
                  <span>{platform}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Terminal Animation */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative overflow-hidden">
              {/* Terminal Window */}
              <div className="rounded-xl border border-white/[0.06] bg-black/60 backdrop-blur-sm overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">
                    terminal
                  </span>
                </div>
                <div className="p-5 font-mono text-sm min-h-[200px]">
                  <div className="flex items-center">
                    <span className="text-[#00ff41]">{terminalText || "$ "}</span>
                    {flowState === "typing" && (
                      <span className="ml-0.5 animate-pulse text-[#00ff41]">▊</span>
                    )}
                  </div>

                  <AnimatePresence>
                    {(flowState === "browser" ||
                      flowState === "connecting" ||
                      flowState === "success") && (
                      <motion.div
                        key="browser-message"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-muted-foreground"
                      >
                        <p className="text-[#00d4ff]">→ Opening browser...</p>
                        <p className="text-muted-foreground/60 text-xs mt-1">
                          Code: <span className="text-[#ffb700]">CERO-2847</span>
                        </p>
                      </motion.div>
                    )}

                    {flowState === "success" && (
                      <motion.div
                        key="success-message"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4"
                      >
                        <div className="flex items-center gap-2 text-[#00ff41]">
                          <IconCheck className="w-4 h-4" />
                          <span>Authenticated!</span>
                        </div>
                        <p className="text-[#00ff41] mt-2">
                          ${" "}
                          <span className="text-muted-foreground">
                            cero chat &quot;hello&quot;
                          </span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Browser popup */}
              <AnimatePresence>
                {(flowState === "browser" ||
                  flowState === "connecting" ||
                  flowState === "success") && (
                  <motion.div
                    initial={{ opacity: 0, x: 30, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 20, y: -10, scale: 1 }}
                    exit={{ opacity: 0, x: 30, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-4 -right-2 lg:-right-4 w-48 lg:w-56 rounded-lg border border-white/[0.06] bg-black/80 backdrop-blur-sm overflow-hidden shadow-xl z-10"
                  >
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
                      <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                      <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                      <span className="ml-1.5 text-[10px] text-muted-foreground truncate">
                        cero.dev
                      </span>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-2">Enter code:</p>
                      <p className="font-mono text-lg text-[#ffb700] font-bold">CERO-2847</p>
                      {flowState === "success" ? (
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-[#00ff41] text-xs">
                          <IconCheck className="w-3 h-3" />
                          Authorized
                        </div>
                      ) : (
                        <div className="mt-3 py-1.5 rounded bg-[#00ff41] text-black text-xs font-medium">
                          {flowState === "connecting" ? "Verifying..." : "Authorize"}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
