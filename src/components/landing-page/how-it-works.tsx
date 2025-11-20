"use client";

import { Card, CardContent } from "@/components/ui/card";
import { STEPS } from "@/lib/constant";
import { IconDownload, IconKey, IconMessageCircle } from "@tabler/icons-react";

export function HowItWorks() {
  const steps = STEPS.map((step) => ({
    ...step,
    icon:
      {
        "01": IconDownload,
        "02": IconKey,
        "03": IconMessageCircle,
      }[step.number] || IconDownload,
  }));

  return (
    <section className="border-b bg-muted/30 px-4 py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Get Started in <span className="text-[#FF6B6B]">3 Steps</span>
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              From installation to your first AI conversation in under a minute
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting line - hidden on mobile */}
            <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-[#FF6B6B] via-[#06B6D4] to-[#374151] md:block" />

            <div className="space-y-8">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden border-2 transition-all hover:shadow-lg hover:scale-[1.02]"
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">
                      {/* Step Number & Icon */}
                      <div className="flex items-center gap-4 md:w-48">
                        <div
                          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold"
                          style={{
                            backgroundColor: `${step.color}20`,
                            color: step.color,
                          }}
                        >
                          {step.number}
                        </div>
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${step.color}10` }}
                        >
                          <step.icon
                            className="h-6 w-6"
                            style={{ color: step.color }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-bold md:text-2xl">
                          {step.title}
                        </h3>
                        <p className="mb-4 text-muted-foreground">
                          {step.description}
                        </p>
                        <div className="rounded-lg border bg-muted/50 px-4 py-3 font-mono text-sm">
                          <span className="text-[#FF6B6B]">$</span>{" "}
                          {step.command}
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Decorative gradient */}
                  <div
                    className="absolute right-0 top-0 h-full w-1 opacity-50"
                    style={{
                      background: `linear-gradient(to bottom, ${step.color}, transparent)`,
                    }}
                  />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
