import type { FontSizeToken, FontWeightToken } from '../../tokens';
import type { Theme } from '../../theme/themes';
import type { TextProps, TextVariant } from './Text.types';

const variants: Record<TextVariant, { size: FontSizeToken; weight: FontWeightToken }> = {
  title: { size: '3xl', weight: 'bold' },
  heading: { size: '2xl', weight: 'bold' },
  subheading: { size: 'lg', weight: 'semibold' },
  body: { size: 'md', weight: 'regular' },
  label: { size: 'sm', weight: 'medium' },
  caption: { size: 'xs', weight: 'regular' },
};

export interface TextStyle {
  color: string;
  fontSize: number;
  /** Absolute line height in px/dp. Web must append `px` (a bare CSS number is a multiplier). */
  lineHeight: number;
  fontWeight: Theme['fontWeights'][FontWeightToken];
  textAlign?: 'left' | 'center' | 'right';
}

export function getTextStyle(props: TextProps, theme: Theme): TextStyle {
  const v = variants[props.variant ?? 'body'];
  return {
    color: theme.colors[props.color ?? 'text'],
    fontSize: theme.fontSizes[v.size],
    lineHeight: theme.lineHeights[v.size],
    fontWeight: theme.fontWeights[props.weight ?? v.weight],
    ...(props.align && { textAlign: props.align }),
  };
}
