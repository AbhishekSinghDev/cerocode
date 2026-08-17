import { RGBA } from "@opentui/core";

/**
 * A translucent tint of `hex` for background blocks — reads as "colored
 * roughly this way" against whatever sits behind it, instead of a flat
 * solid fill. Used to tell message kinds apart by soft background color
 * rather than stacking borders around each one.
 *
 * `alpha` is 0.0–1.0 (RGBA's fields are normalized floats, not 0–255 ints —
 * `RGBA.fromHex(...).a` is already `1`, so setting `.a` to an int like `28`
 * just clamps back to fully opaque instead of a subtle tint).
 */
export function tint(hex: string, alpha: number): RGBA {
  const base = RGBA.fromHex(hex);
  return RGBA.fromValues(base.r, base.g, base.b, alpha);
}
