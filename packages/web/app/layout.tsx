import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://cerocode.heyabhishek.in";
const SITE_DESCRIPTION =
  "cerocode is a terminal AI coding agent. It reads, searches, edits, and writes files, runs shell commands in your project, and streams every response back to your terminal.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "cerocode: an AI coding agent for your terminal",
    template: "%s · cerocode",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "cerocode",
    "AI coding agent",
    "terminal AI",
    "CLI coding assistant",
    "TUI",
    "Bun",
    "OpenTUI",
    "developer tools",
  ],
  authors: [{ name: "Abhishek Singh", url: "https://github.com/AbhishekSinghDev" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "cerocode: an AI coding agent for your terminal",
    description: SITE_DESCRIPTION,
    siteName: "cerocode",
  },
  twitter: {
    card: "summary_large_image",
    title: "cerocode: an AI coding agent for your terminal",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full scroll-smooth",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
      )}
      style={
        {
          "--font-sans": "var(--font-geist-sans)",
          "--font-mono": "var(--font-geist-mono)",
          "--font-heading": "var(--font-geist-sans)",
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
