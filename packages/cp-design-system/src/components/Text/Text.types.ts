import type { ReactNode } from 'react';
import type { Theme, ThemeColor } from '../../theme/types';

export type TextSize = 'small' | 'medium' | 'large';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps {
  children?: ReactNode;
  /** `'small'` 12/16, `'medium'` 14/20, `'large'` 16/24 (Atlassian body styles). Defaults to `'medium'`. */
  size?: TextSize;
  weight?: TextWeight;
  /** A theme text color. Defaults to `'color.text'`. */
  color?: ThemeColor;
  align?: 'start' | 'center' | 'end';
  /** Truncate with an ellipsis after this many lines. */
  maxLines?: number;
  /** Web only. Defaults to `'span'`. */
  as?: 'span' | 'p' | 'strong' | 'em' | 'div' | 'label';
  testID?: string;
}

export const textWeights: Record<TextWeight, number> = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 653,
};

const bodyStyle = { small: 'body.small', medium: 'body', large: 'body.large' } as const;

export function textStyle(theme: Theme, p: TextProps) {
  const s = theme.text[bodyStyle[p.size ?? 'medium']];
  return {
    fontFamily: theme.fontFamily.body,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    fontWeight: p.weight ? textWeights[p.weight] : s.fontWeight,
    color: theme.color[p.color ?? 'color.text'],
    textAlign: p.align === 'end' ? 'right' : p.align === 'center' ? 'center' : undefined,
  } as const;
}
