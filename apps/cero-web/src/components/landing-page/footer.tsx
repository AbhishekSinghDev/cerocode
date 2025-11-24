"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FOOTER_SECTIONS, ME, SOCIAL_LINKS } from "@/lib/constant";
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandTwitter,
} from "@tabler/icons-react";
import type { Route } from "next";
import Link from "next/link";
import Logo from "../shared/logo";

export function Footer() {
  const footerSections = FOOTER_SECTIONS;

  // Map social links with tabler icons
  const socialLinksWithIcons = SOCIAL_LINKS.map((link) => {
    let icon;
    if (link.name === "GitHub") icon = IconBrandGithub;
    else if (link.name === "Twitter") icon = IconBrandTwitter;
    else if (link.name === "Discord") icon = IconBrandDiscord;
    return { ...link, icon };
  });

  return (
    <footer className="border-t bg-muted/30 px-4 py-12 md:py-16">
      <div className="container mx-auto">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-bold">CERO</span>
            </Link>
            <p className="mb-6 max-w-xs text-sm text-muted-foreground">
              AI-powered CLI tool for developers. Chat with LLMs, search the
              web, and execute code—all from your terminal.
            </p>

            {/* Newsletter */}
            <div className="max-w-sm">
              <h3 className="mb-2 text-sm font-semibold">Stay updated</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                Get the latest updates and tips delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-9 text-sm"
                />
                <Button
                  size="sm"
                  className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="mb-4 text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href as any}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} cero. All rights reserved. • Built by{" "}
            <Link
              href={ME.portfolioUrl as Route}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline transition-colors hover:text-foreground"
            >
              {ME.name}
            </Link>
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinksWithIcons.map((social, index) => {
              const IconComponent = social.icon;
              return IconComponent ? (
                <Link
                  key={index}
                  href={social.href as any}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
