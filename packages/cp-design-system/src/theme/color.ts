// Small, dependency-free color utilities: hex parsing, OKLCH conversion and WCAG contrast.
// OKLCH keeps perceived lightness stable when we swap hue, which is what brand ramps need.

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export function parseHex(hex: string): Rgba {
  const value = hex.trim().replace(/^#/, '');
  const full =
    value.length === 3 || value.length === 4
      ? value
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : value;
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(full)) {
    throw new Error(`cp-design-system: "${hex}" is not a valid hex color`);
  }
  const channel = (i: number) => parseInt(full.slice(i, i + 2), 16) / 255;
  return { r: channel(0), g: channel(2), b: channel(4), a: full.length === 8 ? channel(6) : 1 };
}

export function toHex({ r, g, b, a }: Rgba): string {
  const channel = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
  return `#${channel(r)}${channel(g)}${channel(b)}${a < 1 ? channel(a) : ''}`;
}

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const fromLinear = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

export function rgbToOklch({ r, g, b }: Rgba): Oklch {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return { l: L, c: Math.hypot(A, B), h: h < 0 ? h + 360 : h };
}

function oklchToLinearRgb({ l: L, c, h }: Oklch) {
  const rad = (h * Math.PI) / 180;
  const A = c * Math.cos(rad);
  const B = c * Math.sin(rad);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

const inGamut = ({ r, g, b }: { r: number; g: number; b: number }) =>
  [r, g, b].every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** Converts OKLCH to sRGB, reducing chroma (keeping lightness and hue) until it fits the gamut. */
export function oklchToRgb(color: Oklch): Rgba {
  let lin = oklchToLinearRgb(color);
  if (!inGamut(lin)) {
    let lo = 0;
    let hi = color.c;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinearRgb({ ...color, c: mid }))) lo = mid;
      else hi = mid;
    }
    lin = oklchToLinearRgb({ ...color, c: lo });
  }
  return { r: fromLinear(lin.r), g: fromLinear(lin.g), b: fromLinear(lin.b), a: 1 };
}

/** WCAG 2 relative luminance of an opaque color. */
export function luminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** WCAG 2 contrast ratio between two opaque colors (1 to 21). */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
