import { AUTHOR_URL, GITHUB_URL, NPM_URL } from "@/lib/constants";

export const SECTION_LINKS = [
  { label: "Modes", href: "#modes" },
  { label: "Tools", href: "#tools" },
  { label: "Models", href: "#models" },
  { label: "Architecture", href: "#architecture" },
  { label: "Docs", href: "/docs" },
];

export type FooterLink = { label: string; href: string; external?: boolean };

export const FOOTER_COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Product",
    links: SECTION_LINKS,
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
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