import type { ReactNode } from 'react';
import type { Theme, ThemeColor } from '../../theme/types';

export type HeadingSize =
  'xxlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | 'xxsmall';

export interface HeadingProps {
  children?: ReactNode;
  /** Atlassian heading scale, from `'xxlarge'` (32/36) to `'xxsmall'` (12/16). Defaults to `'medium'`. */
  size?: HeadingSize;
  /** Web only: the heading level. Defaults to one that matches the size. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
  /** Defaults to `'color.text'`. */
  color?: ThemeColor;
  align?: 'start' | 'center' | 'end';
  maxLines?: number;
  testID?: string;
}

export const headingLevel: Record<HeadingSize, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
  xxlarge: 'h1',
  xlarge: 'h1',
  large: 'h2',
  medium: 'h3',
  small: 'h4',
  xsmall: 'h5',
  xxsmall: 'h6',
};

export function headingStyle(theme: Theme, p: HeadingProps) {
  const s = theme.text[`heading.${p.size ?? 'medium'}`];
  return {
    fontFamily: theme.fontFamily.heading,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    fontWeight: s.fontWeight,
    color: theme.color[p.color ?? 'color.text'],
    textAlign: p.align === 'end' ? 'right' : p.align === 'center' ? 'center' : undefined,
  } as const;
}
