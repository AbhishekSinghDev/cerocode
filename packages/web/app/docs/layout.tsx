import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { Logo } from "@/components/marketing/logo";
import { GITHUB_URL } from "@/lib/constants";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{ title: <Logo />, url: "/" }}
      githubUrl={GITHUB_URL}
      links={[{ text: "Home", url: "/" }]}
      themeSwitch={{ enabled: false }}
    >
      {children}
    </DocsLayout>
  );
}
