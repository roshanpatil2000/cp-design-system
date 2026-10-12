import type { MotionOverride, Theme, ThemeColor } from '../../theme/types';

export type BadgeAppearance =
  'default' | 'primary' | 'primaryInverted' | 'important' | 'added' | 'removed';

export interface BadgeProps {
  /** A count, or short text. Numbers above `max` show as `99+`. */
  children: number | string;
  /** Defaults to 99. Set to `false` for no limit. */
  max?: number | false;
  /** Defaults to `'default'`. */
  appearance?: BadgeAppearance;
  tokens?: Partial<BadgeTokens>;
  /** Spring for the pop when the count changes, or `false`. Defaults to the theme's `bouncy`. */
  motion?: MotionOverride;
  testID?: string;
}

export interface BadgeTokens {
  background: string;
  text: string;
  minWidth: number;
  paddingX: number;
  radius: number;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  fontFamily?: string;
  /** Scale reached by the pop when the value changes (1 = no pop). */
  popScale: number;
}

const colors: Record<BadgeAppearance, [ThemeColor, ThemeColor]> = {
  default: ['color.background.neutral', 'color.text'],
  primary: ['color.background.brand.bold', 'color.text.inverse'],
  primaryInverted: ['elevation.surface', 'color.text.brand'],
  important: ['color.background.danger.bold', 'color.text.inverse'],
  added: ['color.background.success', 'color.text.success'],
  removed: ['color.background.danger', 'color.text.danger'],
};

export function getBadgeTokens(theme: Theme, p: BadgeProps): BadgeTokens {
  const [bg, text] = colors[p.appearance ?? 'default'];
  return {
    background: theme.color[bg],
    text: p.appearance === 'primary' ? theme.color['color.text.onBrand'] : theme.color[text],
    minWidth: 24,
    paddingX: 6,
    radius: 8,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 400,
    fontFamily: theme.fontFamily.body,
    popScale: 1.25,
  };
}

export function badgeText(value: number | string, max: number | false = 99, added = false) {
  if (typeof value !== 'number') return value;
  const n = max !== false && value > max ? `${max}+` : String(value);
  return added && value > 0 ? `+${n}` : n;
}
