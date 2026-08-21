import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Badge } from "@/components/ui/badge";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Kbd,
    KbdGroup,
    Badge,
    ...components,
  };
}
