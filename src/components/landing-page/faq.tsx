"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FAQ_DATA } from "@/lib/constant";

export function FAQ() {
  const faqs = FAQ_DATA;

  return (
    <section className="border-b bg-muted/30 px-4 py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Frequently Asked <span className="text-[#FF6B6B]">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about cero
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Additional Help */}
          <div className="mt-12 rounded-lg border-2 border-dashed border-border p-8 text-center">
            <h3 className="mb-2 text-xl font-bold text-foreground">
              Still have questions?
            </h3>
            <p className="mb-4 text-muted-foreground">
              Can't find the answer you're looking for? Our support team is here
              to help.
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:support@cero.dev">Contact Support</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
