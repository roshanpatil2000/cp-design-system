import type { ReactNode } from 'react';
import type { Theme, ThemeColor } from '../../theme/types';
import type { StatusKind } from '../internal/statusIconLayout';

export type SectionMessageAppearance =
  'information' | 'warning' | 'error' | 'success' | 'discovery';

export interface SectionMessageAction {
  content: string;
  onPress: () => void;
}

export interface SectionMessageProps {
  /** Defaults to `'information'`. */
  appearance?: SectionMessageAppearance;
  title?: string;
  children?: ReactNode;
  /** Links shown under the message, separated by dots. */
  actions?: SectionMessageAction[];
  /** Status icon, or `false` for none. Defaults to the appearance's icon. */
  icon?: StatusKind | false;
  tokens?: Partial<SectionMessageTokens>;
  testID?: string;
}

export interface SectionMessageTokens {
  background: string;
  icon: string;
  iconGlyph: string;
  title: string;
  text: string;
  action: string;
  padding: number;
  gap: number;
  radius: number;
  iconSize: number;
  fontSize: number;
  lineHeight: number;
  titleFontWeight: number;
  fontFamily?: string;
}

const colors: Record<SectionMessageAppearance, [ThemeColor, ThemeColor]> = {
  information: ['color.background.information', 'color.icon.information'],
  warning: ['color.background.warning', 'color.icon.warning'],
  error: ['color.background.danger', 'color.icon.danger'],
  success: ['color.background.success', 'color.icon.success'],
  discovery: ['color.background.discovery', 'color.icon.discovery'],
};

export const sectionMessageIcon: Record<SectionMessageAppearance, StatusKind> = {
  information: 'info',
  warning: 'warning',
  error: 'error',
  success: 'success',
  discovery: 'info',
};

export function getSectionMessageTokens(
  theme: Theme,
  p: SectionMessageProps,
): SectionMessageTokens {
  const [bg, icon] = colors[p.appearance ?? 'information'];
  return {
    background: theme.color[bg],
    icon: theme.color[icon],
    iconGlyph: theme.color['color.icon.inverse'],
    title: theme.color['color.text'],
    text: theme.color['color.text'],
    action: theme.color['color.link'],
    padding: 16,
    gap: 16,
    radius: theme.radius.small,
    iconSize: 20,
    fontSize: theme.text.body.fontSize,
    lineHeight: theme.text.body.lineHeight,
    titleFontWeight: 653,
    fontFamily: theme.fontFamily.body,
  };
}
