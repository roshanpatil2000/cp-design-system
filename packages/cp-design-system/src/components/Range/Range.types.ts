import type { MotionOverride, Theme } from '../../theme/types';

export interface RangeProps {
  /** Accessible name, e.g. `'Volume'`. */
  label: string;
  /** Controlled value. Leave undefined to let the slider manage its own value. */
  value?: number;
  defaultValue?: number;
  /** Called continuously while dragging and on each key press. */
  onChange?: (value: number) => void;
  /** Defaults to 0. */
  min?: number;
  /** Defaults to 100. */
  max?: number;
  /** Defaults to 1. */
  step?: number;
  isDisabled?: boolean;
  /** Text read by screen readers for a value, e.g. `(v) => \`${v}%\``. */
  formatValue?: (value: number) => string;
  tokens?: Partial<RangeTokens>;
  /** Spring for jumps (taps and keys), or `false`. Drags always follow the finger. */
  motion?: MotionOverride;
  testID?: string;
}

export interface RangeTokens {
  trackHeight: number;
  thumbSize: number;
  /** Thumb scale while dragging. */
  thumbPressedScale: number;
  track: string;
  fill: string;
  thumb: string;
  thumbBorder: string;
  disabledFill: string;
  focusRing: string;
  /** Height of the touch area around the track. */
  hitHeight: number;
}

export function getRangeTokens(theme: Theme): RangeTokens {
  const c = theme.color;
  return {
    trackHeight: 4,
    thumbSize: 16,
    thumbPressedScale: 1.25,
    track: c['color.background.neutral'],
    fill: c['color.background.brand.bold'],
    thumb: c['elevation.surface.raised'],
    thumbBorder: c['color.border'],
    disabledFill: c['color.background.disabled'],
    focusRing: c['color.border.focused'],
    hitHeight: 32,
  };
}

export const clampToStep = (raw: number, min: number, max: number, step: number) => {
  const stepped = Math.round((raw - min) / step) * step + min;
  const decimals = (String(step).split('.')[1] ?? '').length;
  return Math.min(max, Math.max(min, Number(stepped.toFixed(decimals))));
};
