import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FAQ_DATA, ME } from "@/lib/constant";
import Link from "next/link";

export function FAQ() {
  return (
    <section className="border-b border-white/[0.06] bg-white/[0.01] py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked <span className="text-[#00ff41]">Questions</span>
            </h2>
            <p className="text-muted-foreground">Everything you need to know about cero</p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {FAQ_DATA.map((faq, index) => (
              <AccordionItem
                key={`faq-${index}`}
                value={`item-${index}`}
                className="border-white/[0.06]"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:text-[#00ff41]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Additional Help */}
          <div className="mt-12 rounded-lg border border-dashed border-white/[0.1] p-6 text-center">
            <p className="mb-4 text-sm text-muted-foreground">Still have questions?</p>
            <Button variant="outline" size="sm" className="border-white/10" asChild>
              <Link href={`mailto:${ME.email}`}>Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
