import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" fill="var(--background)" />
      <path
        d="M9 11 L15 16 L9 21"
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2.4}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <rect x="17" y="19" width="7" height="2.4" fill="var(--primary)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-base font-medium tracking-tight lowercase",
        className,
      )}
    >
      <span className="text-muted-foreground">cero</span>
      <span className="text-foreground">code</span>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <Wordmark />
    </span>
  );
}
