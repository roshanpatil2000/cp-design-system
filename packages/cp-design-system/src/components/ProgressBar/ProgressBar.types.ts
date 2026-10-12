import type { MotionOverride, Theme } from '../../theme/types';

export type ProgressBarAppearance = 'default' | 'brand' | 'success' | 'inverse';

export interface ProgressBarProps {
  /** Progress from 0 to 1. Ignored when indeterminate. */
  value?: number;
  /** Shows a looping segment when progress is unknown. */
  isIndeterminate?: boolean;
  /** Defaults to `'default'`. Use `'inverse'` on bold or dark surfaces. */
  appearance?: ProgressBarAppearance;
  /** Accessible name, e.g. `'Uploading report'`. */
  label?: string;
  tokens?: Partial<ProgressBarTokens>;
  /** Spring used when the value changes, or `false` to jump. Defaults to the theme's `gentle`. */
  motion?: MotionOverride;
  testID?: string;
}

export interface ProgressBarTokens {
  height: number;
  radius: number;
  track: string;
  bar: string;
  /** Width of the moving segment in the indeterminate state, as a fraction of the track. */
  segment: number;
  /** Milliseconds for one pass of the indeterminate segment. */
  loopDuration: number;
}

export function getProgressBarTokens(theme: Theme, p: ProgressBarProps): ProgressBarTokens {
  const c = theme.color;
  const bar = {
    default: c['color.background.neutral.bold'],
    brand: c['color.background.brand.bold'],
    success: c['color.background.success.bold'],
    inverse: c['elevation.surface'],
  }[p.appearance ?? 'default'];
  return {
    height: 6,
    radius: 3,
    track:
      p.appearance === 'inverse'
        ? c['color.background.inverse.subtle']
        : c['color.background.neutral'],
    bar,
    segment: 0.4,
    loopDuration: 1500,
  };
}

export const clampProgress = (v: number | undefined) => Math.min(1, Math.max(0, v ?? 0));
