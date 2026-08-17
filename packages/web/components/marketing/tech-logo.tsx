import { cn } from "@/lib/utils";

/**
 * Real brand marks via Simple Icons (https://simpleicons.org), rendered as a
 * single flat color that matches whichever tone the section calls for. Not a
 * hand-drawn substitute: every slug below is a verified, currently-served
 * Simple Icons asset.
 */
export function TechLogo({
  slug,
  label,
  color = "9c9ca6",
  size = 18,
  className,
}: {
  slug: string;
  label: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt={label}
      width={size}
      height={size}
      loading="lazy"
      className={cn("inline-block shrink-0", className)}
      style={{ width: size, height: size }}
    />
  );
}
