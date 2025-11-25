"use client";

import {
  IconBolt,
  IconBrain,
  IconDevices,
  IconHistory,
  IconMessageCircle,
  IconPuzzle,
  IconShieldLock,
  IconStack,
  IconTerminal,
  IconTerminal2,
  IconWorld,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { FEATURES } from "@/lib/constant";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "message-circle": IconMessageCircle,
  world: IconWorld,
  bolt: IconBolt,
  "shield-lock": IconShieldLock,
  history: IconHistory,
  devices: IconDevices,
  terminal: IconTerminal,
  brain: IconBrain,
  puzzle: IconPuzzle,
  stack: IconStack,
};

export function Features() {
  return (
    <section id="features" className="relative py-24 border-line">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/20 text-[#00ff41] text-sm font-medium mb-6">
            <IconBrain className="w-4 h-4" />
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need.{" "}
            <span className="text-[#00ff41]">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-muted-foreground">
            Powerful AI capabilities designed for developers who live in their terminal.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon] || IconTerminal2;
            const isUpcoming = feature.status !== "Live";

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group relative p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 ${isUpcoming ? "opacity-80" : ""}`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                    style={{
                      backgroundColor: isUpcoming ? `${feature.color}10` : "#00ff4110",
                      borderColor: isUpcoming ? `${feature.color}30` : "#00ff4130",
                      color: isUpcoming ? feature.color : "#00ff41",
                    }}
                  >
                    {feature.status}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Command (only for live features with commands) */}
                {feature.command && (
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <code
                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono"
                      style={{
                        backgroundColor: `${feature.color}10`,
                        color: feature.color,
                      }}
                    >
                      <IconTerminal2 className="w-3 h-3" />
                      {feature.command}
                    </code>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* GitHub CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground mb-4">Want to follow along or contribute?</p>
          <a
            href="https://github.com/AbhishekSinghDev/cerocode"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-[#00ff41]/30 text-sm font-medium transition-all duration-300"
          >
            <IconTerminal2 className="w-4 h-4 text-[#00ff41]" />
            Check out our GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
