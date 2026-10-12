import type { ReactNode } from 'react';
import type { RadiusToken, SpaceToken, ThemeColor, Theme } from '../../theme/types';

/** Plain style object accepted on both platforms (CSS properties on web, RN styles on native). */
export type StyleObject = Record<string, unknown>;

export interface BoxProps {
  children?: ReactNode;
  padding?: SpaceToken;
  paddingX?: SpaceToken;
  paddingY?: SpaceToken;
  paddingTop?: SpaceToken;
  paddingBottom?: SpaceToken;
  paddingStart?: SpaceToken;
  paddingEnd?: SpaceToken;
  /** A theme color token, e.g. `'elevation.surface.raised'` or `'color.background.neutral'`. */
  backgroundColor?: ThemeColor;
  borderColor?: ThemeColor;
  borderWidth?: keyof Theme['borderWidth'];
  borderRadius?: RadiusToken;
  /** Web only: the element to render. Defaults to `'div'`. */
  as?:
    | 'div'
    | 'span'
    | 'section'
    | 'article'
    | 'aside'
    | 'header'
    | 'footer'
    | 'main'
    | 'nav'
    | 'ul'
    | 'ol'
    | 'li';
  /** Escape hatch for anything tokens don't cover. Applied last. */
  style?: StyleObject;
  testID?: string;
}

/** Turns Box props into a style object with theme values. Shared by both platforms. */
export function boxStyle(theme: Theme, p: BoxProps): StyleObject {
  const s = (token?: SpaceToken) => (token === undefined ? undefined : theme.space[token]);
  const style: StyleObject = {
    padding: s(p.padding),
    paddingLeft: s(p.paddingStart ?? p.paddingX),
    paddingRight: s(p.paddingEnd ?? p.paddingX),
    paddingTop: s(p.paddingTop ?? p.paddingY),
    paddingBottom: s(p.paddingBottom ?? p.paddingY),
    backgroundColor: p.backgroundColor && theme.color[p.backgroundColor],
    borderColor: p.borderColor && theme.color[p.borderColor],
    borderWidth: p.borderWidth && theme.borderWidth[p.borderWidth],
    borderStyle: p.borderWidth ? 'solid' : undefined,
    borderRadius: p.borderRadius && theme.radius[p.borderRadius],
  };
  for (const k of Object.keys(style)) if (style[k] === undefined) delete style[k];
  return style;
}
