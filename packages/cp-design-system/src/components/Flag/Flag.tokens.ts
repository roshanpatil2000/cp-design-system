import type { StatusKind } from '../internal/statusIconLayout';
import type { Theme, ThemeColor } from '../../theme/types';
import type { FlagAppearance } from './Flag.types';

/** Every visual value a Flag uses. Override any of them per theme or per provider. */
export interface FlagTokens {
  width: number;
  radius: number;
  padding: number;
  /** Space between the icon and the text. */
  gap: number;
  /** Space between stacked flags. */
  stackGap: number;
  /** Web: distance from the bottom and left of the window. Native: from the screen edges. */
  offsetBottom: number;
  offsetLeft: number;
  background: string;
  title: string;
  description: string;
  action: string;
  icon: string;
  /** Glyph drawn inside the status icon. */
  iconGlyph: string;
  iconSize: number;
  /** Auto-dismiss countdown bar. */
  progress: string;
  progressHeight: number;
  titleFontSize: number;
  titleLineHeight: number;
  titleFontWeight: number;
  fontSize: number;
  lineHeight: number;
  fontFamily?: string;
  shadow: string;
  focusRing: string;
}

const bold: Record<Exclude<FlagAppearance, 'normal'>, [bg: ThemeColor, text: ThemeColor]> = {
  info: ['color.background.neutral.bold', 'color.text.inverse'],
  success: ['color.background.success.bold', 'color.text.inverse'],
  warning: ['color.background.warning.bold', 'color.text.warning.inverse'],
  error: ['color.background.danger.bold', 'color.text.inverse'],
};

export const defaultFlagIcon: Record<FlagAppearance, StatusKind> = {
  normal: 'info',
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

export function getFlagTokens(theme: Theme, appearance: FlagAppearance): FlagTokens {
  const c = theme.color;
  const base = {
    width: 400,
    radius: theme.radius.large,
    padding: 16,
    gap: 16,
    stackGap: 8,
    offsetBottom: 48,
    offsetLeft: 80,
    iconSize: 20,
    progressHeight: 3,
    titleFontSize: theme.text.body.fontSize,
    titleLineHeight: theme.text.body.lineHeight,
    titleFontWeight: 653,
    fontSize: theme.text.body.fontSize,
    lineHeight: theme.text.body.lineHeight,
    fontFamily: theme.fontFamily.body,
    shadow:
      theme.mode === 'dark'
        ? '0 0 0 1px #BCD6F01F, 0 8px 12px #0304048F, 0 0 1px #03040480'
        : '0 8px 12px #1E1F2126, 0 0 1px #1E1F214F',
    focusRing: c['color.border.focused'],
  };
  if (appearance === 'normal') {
    return {
      ...base,
      background: c['elevation.surface.overlay'],
      title: c['color.text'],
      description: c['color.text'],
      action: c['color.link'],
      icon: c['color.icon.information'],
      iconGlyph: c['color.icon.inverse'],
      progress: c['color.icon.information'],
    };
  }
  const [bg, text] = bold[appearance];
  return {
    ...base,
    background: c[bg],
    title: c[text],
    description: c[text],
    action: c[text],
    icon: c[text],
    iconGlyph: c[bg],
    progress: c[text],
  };
}
