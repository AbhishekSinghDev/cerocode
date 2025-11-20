"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconDatabase,
  IconMessageCircle,
  IconWorld,
} from "@tabler/icons-react";

export function Features() {
  return (
    <section id="features" className="border-b px-4 py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Everything You Need in{" "}
              <span className="text-[#FF6B6B]">One Command</span>
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Powerful AI capabilities designed for developer workflows
            </p>
          </div>

          {/* Features Tabs */}
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-2/3 lg:mx-auto mb-8">
              <TabsTrigger value="chat" className="text-sm sm:text-base">
                <IconMessageCircle className="mr-2 h-4 w-4" />
                Chat Mode
              </TabsTrigger>
              <TabsTrigger value="agent" className="text-sm sm:text-base">
                <IconWorld className="mr-2 h-4 w-4" />
                Agent Mode
              </TabsTrigger>
              <TabsTrigger value="history" className="text-sm sm:text-base">
                <IconDatabase className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Chat Mode */}
            <TabsContent value="chat" className="mt-8">
              <Card className="border-2 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF6B6B]/10">
                    <IconMessageCircle className="h-6 w-6 text-[#FF6B6B]" />
                  </div>
                  <CardTitle className="text-2xl">
                    Direct LLM Conversations
                  </CardTitle>
                  <CardDescription className="text-base">
                    Ask questions and get instant AI responses right in your
                    terminal. Perfect for quick coding help, explanations, and
                    debugging assistance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <pre className="overflow-x-auto text-sm">
                      <code>{`$ cero chat "how do I reverse a string in Python?"

✨ Here are three ways to reverse a string in Python:

1. Using slicing (most Pythonic):
   reversed_str = original_str[::-1]

2. Using reversed() function:
   reversed_str = ''.join(reversed(original_str))

3. Using a loop:
   reversed_str = ''
   for char in original_str:
       reversed_str = char + reversed_str`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Agent Mode */}
            <TabsContent value="agent" className="mt-8">
              <Card className="border-2 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#06B6D4]/10">
                    <IconWorld className="h-6 w-6 text-[#06B6D4]" />
                  </div>
                  <CardTitle className="text-2xl">
                    Internet Search & Code Execution
                  </CardTitle>
                  <CardDescription className="text-base">
                    Enable agent mode to search the web for current information
                    and execute code snippets. Get real-time data and validated
                    solutions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <pre className="overflow-x-auto text-sm">
                      <code>{`$ cero agent "what's the latest Next.js version?"

🔍 Searching the web...
📊 Found 3 sources

Latest Next.js version: 14.0.4 (Released Nov 2023)

Key features:
• Turbopack improvements (5x faster)
• Server Actions (stable)
• Partial Prerendering (preview)

Source: nextjs.org/blog/next-14`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History */}
            <TabsContent value="history" className="mt-8">
              <Card className="border-2 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#374151]/10">
                    <IconDatabase className="h-6 w-6 text-[#374151]" />
                  </div>
                  <CardTitle className="text-2xl">
                    Session History & Search
                  </CardTitle>
                  <CardDescription className="text-base">
                    All conversations are automatically saved and searchable.
                    Never lose important insights or code snippets from previous
                    sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <pre className="overflow-x-auto text-sm">
                      <code>{`$ cero history search "async"

Found 5 conversations:

[2 days ago] "explain async/await"
[1 week ago] "async function error handling"
[2 weeks ago] "Promise vs async/await"

$ cero history show 1

[Session from 2 days ago]
You: explain async/await
AI: Async/await is a way to write...`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
