import type { MotionOverride, Theme, ThemeColor } from '../../theme/types';

export type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
export type AvatarPresence = 'online' | 'busy' | 'focus' | 'offline';

export interface AvatarProps {
  /** The person's or project's name: the accessible name and the source of the initials. */
  name: string;
  /** Image URL. Initials show while it loads and if it fails. */
  src?: string;
  /** `'xsmall'` 16, `'small'` 24, `'medium'` 32, `'large'` 40, `'xlarge'` 96, `'xxlarge'` 128. Defaults to `'medium'`. */
  size?: AvatarSize;
  /** `'circle'` for people, `'square'` for projects and teams. Defaults to `'circle'`. */
  appearance?: 'circle' | 'square';
  /** A status dot in the corner. */
  presence?: AvatarPresence;
  /** Makes the avatar a button. */
  onPress?: () => void;
  isDisabled?: boolean;
  tokens?: Partial<AvatarTokens>;
  motion?: MotionOverride;
  testID?: string;
}

export interface AvatarTokens {
  /** Ring around the avatar, so stacked avatars stay distinct. */
  ring: string;
  ringWidth: number;
  /** Initials background and text; by default picked from the name for variety. */
  background?: string;
  text?: string;
  presenceOnline: string;
  presenceBusy: string;
  presenceFocus: string;
  presenceOffline: string;
  fontFamily?: string;
  fontWeight: number;
  /** Scale while pressed (pressable avatars only). */
  pressedScale: number;
}

export const avatarSizes: Record<AvatarSize, number> = {
  xsmall: 16,
  small: 24,
  medium: 32,
  large: 40,
  xlarge: 96,
  xxlarge: 128,
};

const accents = [
  'blue',
  'green',
  'teal',
  'purple',
  'red',
  'orange',
  'magenta',
  'lime',
  'yellow',
] as const;

/** A stable accent color for a name, so each person keeps the same color everywhere. */
export function nameColors(theme: Theme, name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const accent = accents[h % accents.length]!;
  return {
    background: theme.color[`color.background.accent.${accent}.subtler` as ThemeColor],
    text: theme.color[`color.text.accent.${accent}.bolder` as ThemeColor],
  };
}

/** Up to two initials: first and last word, e.g. "Ada Lovelace" → "AL". */
export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0]![0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function getAvatarTokens(theme: Theme): AvatarTokens {
  const c = theme.color;
  return {
    ring: c['elevation.surface'],
    ringWidth: 2,
    presenceOnline: c['color.icon.success'],
    presenceBusy: c['color.icon.danger'],
    presenceFocus: c['color.icon.discovery'],
    presenceOffline: c['color.icon.subtle'],
    fontFamily: theme.fontFamily.body,
    fontWeight: 653,
    pressedScale: 0.94,
  };
}

export function avatarGeometry(size: number, appearance: 'circle' | 'square') {
  const radius = appearance === 'circle' ? size / 2 : size <= 24 ? 2 : size <= 40 ? 4 : size / 8;
  const dot = Math.max(6, Math.round(size * 0.3));
  return { radius, dot, fontSize: Math.max(8, Math.round(size * 0.4)) };
}

export const presenceLabel: Record<AvatarPresence, string> = {
  online: 'online',
  busy: 'busy',
  focus: 'in focus mode',
  offline: 'offline',
};
