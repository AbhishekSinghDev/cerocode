import { IconArrowLeft, IconHome, IconTerminal2 } from "@tabler/icons-react";
import Link from "next/link";
import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Grid background */}
      <div className="absolute inset-0 grid-lines" />

      <div className="relative z-10 mx-auto max-w-md text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo showText={false} size="lg" />
        </div>

        {/* 404 Display */}
        <div className="mb-6">
          <h2 className="text-8xl font-bold text-[#00ff41] sm:text-9xl">404</h2>
        </div>

        {/* Terminal-style error */}
        <div className="mb-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-left font-mono">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <IconTerminal2 className="h-4 w-4 text-[#00ff41]" />
            <span>error.log</span>
          </div>
          <pre className="text-sm leading-relaxed">
            <code>
              <span className="text-muted-foreground">$ cero navigate</span>
              {"\n\n"}
              <span className="text-[#ff3366]">Error:</span>{" "}
              <span className="text-foreground">Route not found</span>
              {"\n"}
              <span className="text-muted-foreground">Path:</span>{" "}
              <span className="text-[#00d4ff]">/unknown</span>
              {"\n\n"}
              <span className="text-[#ffb700]">→ Try going back home</span>
            </code>
          </pre>
        </div>

        {/* Headline */}
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Page not found
        </h1>

        <p className="mb-8 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="w-full bg-[#00ff41] font-medium text-black hover:bg-[#00ff41]/90 sm:w-auto"
            asChild
          >
            <Link href="/">
              <IconHome className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-white/10 hover:border-white/20 sm:w-auto"
            asChild
          >
            <Link href="javascript:history.back()">
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
