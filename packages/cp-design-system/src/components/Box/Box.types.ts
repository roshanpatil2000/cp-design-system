import type { ReactNode } from 'react';
import type { RadiusToken, SpacingToken } from '../../tokens';
import type { ThemeColor } from '../../theme/themes';

/** Sizes valid on both web (CSS) and native (RN `DimensionValue`). */
export type Dimension = number | 'auto' | `${number}%`;

export interface BoxProps {
  children?: ReactNode;
  /** Padding on all sides (spacing token). */
  p?: SpacingToken;
  px?: SpacingToken;
  py?: SpacingToken;
  /** Margin on all sides (spacing token). */
  m?: SpacingToken;
  mx?: SpacingToken;
  my?: SpacingToken;
  bg?: ThemeColor;
  radius?: RadiusToken;
  borderColor?: ThemeColor;
  borderWidth?: number;
  flex?: number;
  /** Defaults to `'column'` on both platforms (matches React Native). */
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?:
    'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: SpacingToken;
  wrap?: boolean;
  width?: Dimension;
  height?: Dimension;
  testID?: string;
}
