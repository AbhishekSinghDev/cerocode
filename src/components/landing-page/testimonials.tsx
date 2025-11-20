"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { TESTIMONIALS } from "@/lib/constant";
import { IconStar } from "@tabler/icons-react";

export function Testimonials() {
  const testimonials = TESTIMONIALS;

  return (
    <section className="border-b bg-muted/30 px-4 py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Loved by <span className="text-[#FF6B6B]">Developers</span>
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Join thousands of developers boosting their productivity
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-2 transition-all hover:shadow-lg hover:scale-[1.02]"
              >
                <CardContent className="p-6">
                  {/* Stars */}
                  <div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <IconStar
                        key={i}
                        className="h-4 w-4 fill-[#FF6B6B] text-[#FF6B6B]"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="mb-6 text-base leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-[#FF6B6B]/20">
                      <AvatarFallback className="bg-[#FF6B6B]/10 text-[#FF6B6B] font-bold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
