import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";

export function DemoSection() {
  return (
    <section id="demo" className="border-t border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          title="See it in action."
          description="A real session: reading a repo, planning a change, switching into BUILD mode, and editing files with approval gates."
        />

        <Reveal delay={0.1} className="mt-10">
          <div className="border border-border bg-terminal-bg shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
            <div className="flex h-9 items-center gap-3 border-b border-border/80 px-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="size-2 bg-terminal-slate" />
                <span className="size-2 bg-terminal-slate" />
                <span className="size-2 bg-terminal-slate" />
              </div>
              <span className="font-mono text-[11px] text-terminal-slate">
                cerocode-demo.mp4
              </span>
            </div>

            <video
              className="aspect-video w-full bg-black"
              controls
              muted
              loop
              playsInline
              preload="metadata"
              poster="/cerocode-demo-poster.jpg"
            >
              <source src="/cerocode-demo.mp4" type="video/mp4" />
            </video>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
