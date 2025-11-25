"use client";

import { IconBrandGithub, IconCheck, IconCopy, IconTerminal2 } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { INSTALL_COMMAND } from "@/lib/constant";

export function CTABanner() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="install" className="relative py-24 border-line">
      {/* Grid background */}
      <div className="absolute inset-0 grid-lines" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            AI in your <span className="text-[#00ff41]">terminal.</span>
          </h2>

          <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
            One command to install. One browser login to authenticate. Then start chatting with
            AI, right from your terminal. No API keys, no configuration hell.
          </p>

          {/* Install Command */}
          <motion.div
            className="max-w-md mx-auto mb-8"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 rounded-xl bg-white/[0.02] border border-[#00ff41]/20 hover:border-[#00ff41]/40 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <IconTerminal2 className="w-5 h-5 text-[#00ff41]" />
                <code className="font-mono text-foreground">
                  <span className="text-[#00ff41]">$</span> {INSTALL_COMMAND}
                </code>
              </div>

              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  copied
                    ? "bg-[#00ff41]/20 text-[#00ff41]"
                    : "bg-white/5 text-muted-foreground  group-hover:text-[#00ff41]"
                }`}
              >
                {copied ? (
                  <>
                    <IconCheck className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <IconCopy className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Copy</span>
                  </>
                )}
              </div>
            </Button>
          </motion.div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-[#00ff41] text-black font-medium transition-all duration-300 min-w-[160px]"
              asChild
            >
              <Link href="/docs">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 hover:border-white/20 transition-all duration-300 min-w-[160px]"
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

          {/* Trust Signals */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="text-[#00ff41]">✓</span>
              Open Source
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#00ff41]">✓</span>
              No API Keys
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#00ff41]">✓</span>
              Real-time Streaming
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
