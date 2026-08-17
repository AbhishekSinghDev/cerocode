import { TextAttributes } from "@opentui/core";

type BadgeProps = {
  label: string;
  color: string;
  tone?: "solid" | "outline";
  textColor?: string;
};

/**
 * Small status chip used for mode/model indicators across the header,
 * footer, and composer. `solid` fills the badge with `color`; `outline`
 * (default) just colors the label text, for lower-emphasis placements.
 */
export function Badge({ label, color, tone = "outline", textColor }: BadgeProps) {
  if (tone === "solid") {
    return (
      <box paddingX={1} backgroundColor={color}>
        <text attributes={TextAttributes.BOLD} fg={textColor ?? "#0B0B0F"}>
          {label}
        </text>
      </box>
    );
  }

  return (
    <text attributes={TextAttributes.BOLD} fg={color}>
      {label}
    </text>
  );
}
