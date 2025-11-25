"use client";

import {
  IconDownload,
  IconMessageCircle,
  IconTerminal,
  IconTerminal2,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

import { STEPS } from "@/lib/constant";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  download: IconDownload,
  terminal: IconTerminal,
  "message-circle": IconMessageCircle,
};

export function HowItWorks() {
  return (
    <section className="relative py-24 border-line">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            From setup to <span className="text-[#00ff41]">productivity</span>
          </h2>
          <p className="text-muted-foreground">
            Get started in minutes with our interactive terminal experience.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, index) => {
            const Icon = iconMap[step.icon] || IconTerminal2;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              >
                {/* Step Number */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-xl font-bold mb-5"
                  style={{
                    backgroundColor: `${step.color}15`,
                    color: step.color,
                  }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <Icon className="w-6 h-6" style={{ color: step.color }} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {step.description}
                </p>

                {/* Command */}
                <div className="p-3 rounded-lg bg-black/30 border border-white/[0.04] font-mono text-xs">
                  <span style={{ color: step.color }}>$</span>{" "}
                  <span className="text-foreground/80">{step.command}</span>
                </div>

                {/* Connection line (not on last item) */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-white/[0.06]" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
