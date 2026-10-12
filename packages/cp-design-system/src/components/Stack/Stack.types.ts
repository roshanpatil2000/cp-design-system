import type { ReactNode } from 'react';
import type { SpaceToken, Theme } from '../../theme/types';
import type { BoxProps, StyleObject } from '../Box/Box.types';

type Align = 'start' | 'center' | 'end' | 'stretch';

export interface StackProps extends Omit<BoxProps, 'children'> {
  children?: ReactNode;
  /** Gap between children. Defaults to `'0'`. */
  space?: SpaceToken;
  /** Horizontal alignment of children. Defaults to `'stretch'`. */
  alignInline?: Align;
  /** `'fill'` takes the available height and pushes extra space to the end. */
  grow?: 'hug' | 'fill';
}

export interface InlineProps extends Omit<BoxProps, 'children'> {
  children?: ReactNode;
  /** Gap between children. Defaults to `'0'`. */
  space?: SpaceToken;
  /** Gap between wrapped rows. Defaults to `space`. */
  rowSpace?: SpaceToken;
  /** Vertical alignment. Defaults to `'start'`. */
  alignBlock?: Align | 'baseline';
  /** Horizontal alignment. Defaults to `'start'`. */
  alignInline?: Exclude<Align, 'stretch'>;
  /** `'space-between'` spreads children across the row. */
  spread?: 'space-between';
  /** Wrap onto new rows when out of room. */
  shouldWrap?: boolean;
  /** Rendered between each pair of children, e.g. `'·'`. */
  separator?: ReactNode;
}

const flex = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
} as const;

export function stackStyle(theme: Theme, p: StackProps): StyleObject {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space[p.space ?? '0'],
    alignItems: flex[p.alignInline ?? 'stretch'],
    flexGrow: p.grow === 'fill' ? 1 : undefined,
  };
}

export function inlineStyle(theme: Theme, p: InlineProps): StyleObject {
  return {
    display: 'flex',
    flexDirection: 'row',
    columnGap: theme.space[p.space ?? '0'],
    rowGap: theme.space[p.rowSpace ?? p.space ?? '0'],
    alignItems: flex[p.alignBlock ?? 'start'],
    justifyContent: p.spread ?? flex[p.alignInline ?? 'start'],
    flexWrap: p.shouldWrap ? 'wrap' : 'nowrap',
  };
}
