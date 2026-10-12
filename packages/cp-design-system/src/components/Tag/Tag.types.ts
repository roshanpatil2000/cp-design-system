import type { MotionOverride, Theme, ThemeColor } from '../../theme/types';

export type TagColor =
  | 'standard'
  | 'blue'
  | 'green'
  | 'teal'
  | 'purple'
  | 'red'
  | 'yellow'
  | 'orange'
  | 'magenta'
  | 'lime'
  | 'gray';

export interface TagProps {
  text: string;
  /** Defaults to `'standard'` (neutral). */
  color?: TagColor;
  /** `'rounded'` for pill-shaped tags, e.g. people. Defaults to `'default'`. */
  appearance?: 'default' | 'rounded';
  /** Shows a remove button. The tag animates out, then `onRemove` is called. */
  isRemovable?: boolean;
  onRemove?: () => void;
  /** Accessible name of the remove button. Defaults to `Remove ${text}`. */
  removeButtonLabel?: string;
  tokens?: Partial<TagTokens>;
  motion?: MotionOverride;
  testID?: string;
}

export interface TagTokens {
  background: string;
  text: string;
  height: number;
  paddingX: number;
  radius: number;
  fontSize: number;
  lineHeight: number;
  fontFamily?: string;
  maxWidth: number;
  removeHovered: string;
  focusRing: string;
}

export function getTagTokens(theme: Theme, p: TagProps): TagTokens {
  const color = p.color ?? 'standard';
  const [bg, text]: [ThemeColor, ThemeColor] =
    color === 'standard'
      ? ['color.background.neutral', 'color.text']
      : [
          `color.background.accent.${color}.subtler` as ThemeColor,
          `color.text.accent.${color}.bolder` as ThemeColor,
        ];
  return {
    background: theme.color[bg],
    text: theme.color[text],
    height: 20,
    paddingX: 4,
    radius: p.appearance === 'rounded' ? 10 : 3,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: theme.fontFamily.body,
    maxWidth: 200,
    removeHovered: theme.color['color.background.danger.subtler'],
    focusRing: theme.color['color.border.focused'],
  };
}
