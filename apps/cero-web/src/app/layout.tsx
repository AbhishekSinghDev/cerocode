import "@/styles/globals.css";

import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "cero - AI-Powered Terminal Assistant",
  description:
    "AI in your terminal. Chat with LLMs, search the web, execute code—no API keys, no config hell. Free and open source.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: ["AI", "CLI", "terminal", "developer tools", "LLM", "open source"],
  authors: [{ name: "Abhishek Singh", url: "https://abhisheksingh.me" }],
  openGraph: {
    title: "cero - AI-Powered Terminal Assistant",
    description: "AI in your terminal. No API keys, no config hell.",
    type: "website",
  },
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${spaceGrotesk.className} ${jetbrainsMono.variable} scroll-smooth dark`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
