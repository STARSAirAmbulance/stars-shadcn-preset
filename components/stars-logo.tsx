import type { ComponentPropsWithoutRef } from "react";

/**
 * The STARS logo as an image from /brand (installed by the `stars-logos` registry item).
 * The wordmark exists in Critical Care Red, black, and white; the S-mark also in Midnight
 * Blue, Hopeful Blue, Saving Grey, and Misty White. Use the wordmark wherever it fits; the
 * mark alone only in tight spaces (a collapsed sidebar, a favicon). Keep clear space of at
 * least the height of the "S" around the wordmark, and never recolour, stretch, or place it
 * on a busy background.
 */
export type StarsWordmarkColor = "red" | "black" | "white";
export type StarsMarkColor = StarsWordmarkColor | "midnight" | "hopeful" | "grey" | "mist";

type Base = Omit<ComponentPropsWithoutRef<"img">, "src" | "width" | "height" | "alt"> & {
  /** Rendered height in CSS pixels; the width follows the artwork's proportions. */
  height?: number;
  /** Accessible name. Use "" only when the logo sits next to visible text that names STARS. */
  alt?: string;
};

export type StarsLogoProps =
  | (Base & { variant?: "wordmark"; color?: StarsWordmarkColor })
  | (Base & { variant: "mark"; color?: StarsMarkColor });

const RATIO = { wordmark: 2783 / 741.27, mark: 1180 / 827.95 };

export function StarsLogo(props: StarsLogoProps) {
  const { variant = "wordmark", color = "red", height = 28, alt = "STARS", ...rest } = props;
  const file = `/brand/stars-${variant}-${color}.svg`;
  return <img src={file} alt={alt} height={height} width={Math.round(height * RATIO[variant])} decoding="async" {...rest} />;
}
