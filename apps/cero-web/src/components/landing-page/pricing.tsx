"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PRICING_PLANS } from "@/lib/constant";
import { IconCheck } from "@tabler/icons-react";

export function Pricing() {
  const plans = PRICING_PLANS;

  return (
    <section id="pricing" className="border-b px-4 py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Simple,{" "}
              <span className="text-[#FF6B6B]">Transparent Pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative flex flex-col ${
                  plan.highlighted
                    ? "border-2 border-[#FF6B6B] shadow-xl scale-105"
                    : "border-2"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2 text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-muted-foreground ml-1">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <IconCheck className="h-5 w-5 shrink-0 text-[#FF6B6B] mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              ✨ <strong>No credit card required</strong> • Cancel anytime •
              14-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
