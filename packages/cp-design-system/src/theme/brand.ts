import { atlassianBlueRamp, type BrandStep } from '../tokens/atlassian/brand.generated';
import { contrastRatio, oklchToRgb, parseHex, rgbToOklch, toHex } from './color';

export type BrandRamp = Record<BrandStep, string>;

const STEPS = Object.keys(atlassianBlueRamp) as BrandStep[];
const blue = Object.fromEntries(
  STEPS.map((step) => [step, rgbToOklch(parseHex(atlassianBlueRamp[step]))]),
) as Record<BrandStep, ReturnType<typeof rgbToOklch>>;

const blueLightnesses = STEPS.map((step) => blue[step].l);
const LIGHTEST = Math.max(...blueLightnesses);
const DARKEST = Math.min(...blueLightnesses);

/**
 * Builds a 12-step brand ramp that follows the lightness profile of Atlassian's Blue ramp.
 *
 * `anchor` is the step that equals `color` exactly: 700 for light mode, where it is the bold brand
 * color, and 400 for dark mode. Lightness is remapped linearly on each side of the anchor, so the
 * ramp keeps Atlassian's order and spacing for any brand color, and its lightest and darkest steps
 * stay at Atlassian's values (subtle backgrounds stay subtle).
 */
export function createBrandRamp(color: string, anchor: BrandStep = '700'): BrandRamp {
  const brand = rgbToOklch(parseHex(color));
  const base = blue[anchor];
  const chromaScale = base.c > 0 ? brand.c / base.c : 0;
  // Leave room for lighter and darker steps even when the brand itself is very light or dark.
  const top = Math.min(0.99, Math.max(LIGHTEST, brand.l + 0.03));
  const bottom = Math.max(0.05, Math.min(DARKEST, brand.l - 0.03));

  return Object.fromEntries(
    STEPS.map((step) => {
      if (step === anchor) return [step, toHex(parseHex(color))];
      const source = blue[step].l;
      const l =
        source >= base.l
          ? brand.l + ((source - base.l) / (LIGHTEST - base.l || 1)) * (top - brand.l)
          : brand.l - ((base.l - source) / (base.l - DARKEST || 1)) * (brand.l - bottom);
      const c = blue[step].c * chromaScale;
      return [step, toHex(oklchToRgb({ l, c, h: brand.h }))];
    }),
  ) as BrandRamp;
}

/** Picks whichever of white or near-black text has the higher contrast on `background`. */
export function readableTextOn(background: string, light = '#FFFFFF', dark = '#1E1F21'): string {
  return contrastRatio(background, light) >= contrastRatio(background, dark) ? light : dark;
}
