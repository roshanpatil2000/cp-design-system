import type { ReactNode } from 'react';
import type { MotionOverride, Theme, ThemeColor } from '../../theme/types';
import type { StatusKind } from '../internal/statusIconLayout';

export type BannerAppearance = 'warning' | 'error' | 'announcement';

export interface BannerProps {
  children: ReactNode;
  /** Defaults to `'warning'`. */
  appearance?: BannerAppearance;
  /** Status icon before the text, or `false` for none. Announcements have none by default. */
  icon?: StatusKind | false;
  /** Slides the banner in and out. Defaults to `true`. */
  isOpen?: boolean;
  tokens?: Partial<BannerTokens>;
  motion?: MotionOverride;
  testID?: string;
}

export interface BannerTokens {
  background: string;
  text: string;
  icon: string;
  iconGlyph: string;
  paddingX: number;
  paddingY: number;
  gap: number;
  iconSize: number;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  fontFamily?: string;
}

const colors: Record<BannerAppearance, [ThemeColor, ThemeColor]> = {
  warning: ['color.background.warning.bold', 'color.text.warning.inverse'],
  error: ['color.background.danger.bold', 'color.text.inverse'],
  announcement: ['color.background.neutral.bold', 'color.text.inverse'],
};

export const defaultBannerIcon: Record<BannerAppearance, StatusKind | null> = {
  warning: 'warning',
  error: 'error',
  announcement: null,
};

export function getBannerTokens(theme: Theme, p: BannerProps): BannerTokens {
  const [bg, text] = colors[p.appearance ?? 'warning'];
  return {
    background: theme.color[bg],
    text: theme.color[text],
    icon: theme.color[text],
    iconGlyph: theme.color[bg],
    paddingX: 16,
    paddingY: 12,
    gap: 8,
    iconSize: 16,
    fontSize: theme.text.body.fontSize,
    lineHeight: theme.text.body.lineHeight,
    fontWeight: 500,
    fontFamily: theme.fontFamily.body,
  };
}
