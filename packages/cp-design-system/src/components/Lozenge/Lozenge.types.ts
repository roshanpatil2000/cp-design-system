import type { ReactNode } from 'react';
import type { Theme, ThemeColor } from '../../theme/types';

export type LozengeAppearance = 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success';

export interface LozengeProps {
  children: ReactNode;
  /** Defaults to `'default'`. */
  appearance?: LozengeAppearance;
  /** A solid, high-emphasis background. */
  isBold?: boolean;
  /** Truncates longer text with an ellipsis. Defaults to 200. */
  maxWidth?: number;
  tokens?: Partial<LozengeTokens>;
  testID?: string;
}

export interface LozengeTokens {
  background: string;
  text: string;
  radius: number;
  paddingX: number;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  fontFamily?: string;
  /** Atlassian lozenges are uppercase; set false for sentence case. */
  uppercase: boolean;
}

const subtle: Record<LozengeAppearance, [ThemeColor, ThemeColor]> = {
  default: ['color.background.neutral', 'color.text.subtle'],
  inprogress: ['color.background.information', 'color.text.information'],
  moved: ['color.background.warning', 'color.text.warning'],
  new: ['color.background.discovery', 'color.text.discovery'],
  removed: ['color.background.danger', 'color.text.danger'],
  success: ['color.background.success', 'color.text.success'],
};

const bold: Record<LozengeAppearance, [ThemeColor, ThemeColor]> = {
  default: ['color.background.neutral.bold', 'color.text.inverse'],
  inprogress: ['color.background.information.bold', 'color.text.inverse'],
  moved: ['color.background.warning.bold', 'color.text.warning.inverse'],
  new: ['color.background.discovery.bold', 'color.text.inverse'],
  removed: ['color.background.danger.bold', 'color.text.inverse'],
  success: ['color.background.success.bold', 'color.text.inverse'],
};

export function getLozengeTokens(theme: Theme, p: LozengeProps): LozengeTokens {
  const [bg, text] = (p.isBold ? bold : subtle)[p.appearance ?? 'default'];
  return {
    background: theme.color[bg],
    text: theme.color[text],
    radius: 3,
    paddingX: 4,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: 653,
    fontFamily: theme.fontFamily.body,
    uppercase: true,
  };
}
