import type { ReactNode } from 'react';
import type { FontWeightToken } from '../../tokens';
import type { ThemeColor } from '../../theme/themes';

export type TextVariant = 'title' | 'heading' | 'subheading' | 'body' | 'label' | 'caption';

export interface TextProps {
  children?: ReactNode;
  /** Typographic preset. Defaults to `'body'`. */
  variant?: TextVariant;
  /** Theme color. Defaults to `'text'`. */
  color?: ThemeColor;
  /** Overrides the variant's weight. */
  weight?: FontWeightToken;
  align?: 'left' | 'center' | 'right';
  /** Truncate after this many lines. */
  numberOfLines?: number;
  testID?: string;
}
