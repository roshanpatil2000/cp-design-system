import type { ThemeColor } from '../../theme/types';

export type IconGlyph =
  | 'check'
  | 'cross'
  | 'add'
  | 'remove'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type IconSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface IconProps {
  glyph: IconGlyph;
  /** `'small'` 12, `'medium'` 16, `'large'` 24, `'xlarge'` 32, or a number. Defaults to `'medium'`. */
  size?: IconSize | number;
  /**
   * A theme color token or any color string. Defaults to `'color.icon'`, or the matching status
   * color for `info`, `success`, `warning` and `error`.
   */
  color?: ThemeColor | (string & {});
  /** Accessible name. Without it the icon is decorative and hidden from assistive tech. */
  label?: string;
  testID?: string;
}

export const iconSizes: Record<IconSize, number> = { small: 12, medium: 16, large: 24, xlarge: 32 };

/** A stroke drawn as a box: a filled bar, or an "L" (right and bottom borders) for ticks and chevrons. */
export interface IconPart {
  kind: 'bar' | 'ell';
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
}

const statusGlyphs = ['info', 'success', 'warning', 'error'] as const;
export const isStatusGlyph = (g: IconGlyph): g is (typeof statusGlyphs)[number] =>
  (statusGlyphs as readonly string[]).includes(g);

/** Geometry for the line glyphs, scaled to `size`. Status glyphs use the shared StatusIcon. */
export function iconLayout(glyph: IconGlyph, size: number): { stroke: number; parts: IconPart[] } {
  const stroke = Math.max(1.5, Math.round((size / 8) * 2) / 2);
  const centered = (
    kind: IconPart['kind'],
    w: number,
    h: number,
    cx: number,
    cy: number,
    rotate: number,
  ): IconPart => ({
    kind,
    width: w,
    height: h,
    left: cx * size - w / 2,
    top: cy * size - h / 2,
    rotate,
  });
  const bar = (rotate: number) => centered('bar', size * 0.75, stroke, 0.5, 0.5, rotate);
  const chevron = (cx: number, cy: number, rotate: number) =>
    centered('ell', size * 0.42, size * 0.42, cx, cy, rotate);
  switch (glyph) {
    case 'add':
      return { stroke, parts: [bar(0), bar(90)] };
    case 'remove':
      return { stroke, parts: [bar(0)] };
    case 'cross':
      return { stroke, parts: [bar(45), bar(-45)] };
    case 'check':
      return { stroke, parts: [centered('ell', size * 0.32, size * 0.58, 0.5, 0.44, 45)] };
    case 'chevron-down':
      return { stroke, parts: [chevron(0.5, 0.38, 45)] };
    case 'chevron-up':
      return { stroke, parts: [chevron(0.5, 0.62, -135)] };
    case 'chevron-right':
      return { stroke, parts: [chevron(0.38, 0.5, -45)] };
    case 'chevron-left':
      return { stroke, parts: [chevron(0.62, 0.5, 135)] };
    default:
      return { stroke, parts: [] };
  }
}

/** Default colors for the status glyphs, so they read correctly at a glance. */
export const statusGlyphColor: Record<'info' | 'success' | 'warning' | 'error', ThemeColor> = {
  info: 'color.icon.information',
  success: 'color.icon.success',
  warning: 'color.icon.warning',
  error: 'color.icon.danger',
};
