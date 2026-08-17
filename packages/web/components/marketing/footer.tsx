import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, ArrowUpRight02Icon } from "@hugeicons/core-free-icons";
import { Logo } from "./logo";
import { Container } from "./section";

const GITHUB_URL = "https://github.com/AbhishekSinghDev/cerocode";
const NPM_URL = "https://www.npmjs.com/package/cerocode";
const AUTHOR_URL = "https://heyabhishek.in";

type FooterLink = { label: string; href: string; external?: boolean };

const COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Modes", href: "#modes" },
      { label: "Tools", href: "#tools" },
      { label: "Models", href: "#models" },
      { label: "Architecture", href: "#architecture" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "GitHub", href: GITHUB_URL, external: true },
      { label: "npm package", href: NPM_URL, external: true },
      {
        label: "MIT license",
        href: `${GITHUB_URL}/blob/main/LICENSE`,
        external: true,
      },
    ],
  },
  {
    heading: "Author",
    links: [{ label: "Abhishek Singh", href: AUTHOR_URL, external: true }],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              An open source AI coding agent for the terminal.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="font-mono text-xs tracking-wide text-muted-foreground">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                      {link.external ? (
                        <HugeiconsIcon
                          icon={ArrowUpRight02Icon}
                          size={12}
                          strokeWidth={1.5}
                        />
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 cerocode. MIT licensed.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="cerocode on GitHub"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={GithubIcon} size={16} strokeWidth={1.5} />
          </a>
        </div>
      </Container>
    </footer>
  );
}
