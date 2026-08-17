import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";

type ModelRow = {
  provider: string;
  id: string;
  tier: "free" | "paid";
  isDefault?: boolean;
};

// Mirrors packages/shared/src/models.ts. This list grows without touching
// the CLI or server: every model is one entry in a typed registry keyed by
// provider and id.
const MODELS: ModelRow[] = [
  { provider: "groq", id: "openai/gpt-oss-20b", tier: "free" },
  { provider: "groq", id: "openai/gpt-oss-120b", tier: "free" },
  { provider: "groq", id: "qwen/qwen3.6-27b", tier: "free" },
  { provider: "mistral", id: "ministral-8b-latest", tier: "free" },
  { provider: "mistral", id: "mistral-small-latest", tier: "free" },
  {
    provider: "mistral",
    id: "devstral-small-latest",
    tier: "free",
    isDefault: true,
  },
  { provider: "mistral", id: "codestral-latest", tier: "free" },
  { provider: "mistral", id: "mistral-large-latest", tier: "free" },
  { provider: "openrouter", id: "deepseek/deepseek-v4-flash-0731", tier: "paid" },
  { provider: "google", id: "gemini-3.5-flash-lite", tier: "paid" },
  { provider: "google", id: "gemini-2.5-flash", tier: "paid" },
  { provider: "google", id: "gemini-3.6-flash", tier: "paid" },
  { provider: "google", id: "gemini-3.1-pro-preview", tier: "paid" },
];

export function ModelsSection() {
  return (
    <section id="models" className="border-t border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          title="Any model you want to run."
          description="Every provider sits behind one typed registry. Adding a model is a config entry, not a rewrite."
        />

        <Reveal delay={0.1} className="mt-10">
          <div className="border border-border bg-card">
            <div className="flex h-9 items-center gap-2 border-b border-border px-4">
              <span className="size-2 bg-muted-foreground/40" aria-hidden="true" />
              <span className="font-mono text-[11px] text-muted-foreground">
                /models
              </span>
            </div>
            <div className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-6 sm:text-[13px]">
              {MODELS.map((model) => (
                <div key={model.id} className="flex items-center gap-4 whitespace-nowrap">
                  <span className="w-[78px] shrink-0 text-primary">
                    {model.provider}
                  </span>
                  <span className="w-[260px] shrink-0 text-foreground">
                    {model.id}
                  </span>
                  <span
                    className={
                      model.tier === "free"
                        ? "w-9 shrink-0 text-[#82E0AA]"
                        : "w-9 shrink-0 text-muted-foreground"
                    }
                  >
                    {model.tier}
                  </span>
                  {model.isDefault ? (
                    <span className="shrink-0 text-muted-foreground">
                      default
                    </span>
                  ) : null}
                </div>
              ))}
              <div className="mt-3 whitespace-nowrap text-muted-foreground/70">
                # new provider, new model → one entry in the registry
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
