"use client";

import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandTwitter,
  IconTerminal2,
} from "@tabler/icons-react";
import Link from "next/link";
import { FOOTER_LINKS, ME } from "@/lib/constant";
import Logo from "../shared/logo";

const socialLinks = [
  {
    icon: IconBrandGithub,
    href: "https://github.com/AbhishekSinghDev/cerocode",
    label: "GitHub",
  },
  { icon: IconBrandTwitter, href: "https://twitter.com/cerodev", label: "Twitter" },
  { icon: IconBrandDiscord, href: "https://discord.gg/cero", label: "Discord" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              AI-powered terminal assistant for developers.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-[#00ff41] hover:border-[#00ff41]/20 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-[#00ff41] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-[#00ff41] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconTerminal2 className="w-4 h-4 text-[#00ff41]" />
            <span>Built by</span>
            <a
              href={ME.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-[#00ff41] transition-colors"
            >
              {ME.name}
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} cerocode
          </p>
        </div>
      </div>
    </footer>
  );
}
