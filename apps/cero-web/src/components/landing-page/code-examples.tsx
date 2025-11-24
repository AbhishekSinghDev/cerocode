"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CODE_EXAMPLES } from "@/lib/constant";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";

export function CodeExamples() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const examples = CODE_EXAMPLES;

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="border-b px-4 py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              See It in <span className="text-[#FF6B6B]">Action</span>
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Real examples of cero solving everyday development challenges
            </p>
          </div>

          {/* Code Examples Tabs */}
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="chat">Normal Chat</TabsTrigger>
              <TabsTrigger value="search">Web Search</TabsTrigger>
              <TabsTrigger value="execute">Code Execution</TabsTrigger>
            </TabsList>

            {examples.map((example) => (
              <TabsContent key={example.id} value={example.id} className="mt-8">
                <Card className="overflow-hidden py-0 border-2">
                  {/* Header */}
                  <div className="border-b bg-muted/50 px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {example.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {example.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard(example.code, example.id)
                        }
                        className="shrink-0"
                      >
                        {copiedIndex === example.id ? (
                          <>
                            <IconCheck className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <IconCopy className="mr-2 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Terminal Window */}
                  <div className="bg-[#1e1e1e] p-6">
                    <div className="mb-4 flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                      <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                      <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <pre className="overflow-x-auto">
                      <code className="text-sm font-mono leading-relaxed text-[#d4d4d4]">
                        {example.code}
                      </code>
                    </pre>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
