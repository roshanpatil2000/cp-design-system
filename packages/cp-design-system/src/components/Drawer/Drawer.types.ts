import type { ReactNode } from 'react';
import type { MotionOverride, Theme } from '../../theme/types';

export type DrawerWidth = 'narrow' | 'medium' | 'wide' | 'extended';

export interface DrawerProps {
  isOpen: boolean;
  /** Called on Escape, a blanket click, the close button, a swipe down (native) and Android back. */
  onClose: () => void;
  children?: ReactNode;
  /** Heading shown at the top, also the accessible name. */
  title?: string;
  /** Accessible name when there's no title. */
  label?: string;
  /** Web: which edge it slides from. Defaults to `'left'` (Atlassian's drawer). */
  placement?: 'left' | 'right';
  /** Web: `'narrow'` 360, `'medium'` 480, `'wide'` 600, `'extended'` 95vw, or px. Defaults to `'narrow'`. */
  width?: DrawerWidth | number;
  /** Called after the close animation finishes. */
  onCloseComplete?: () => void;
  tokens?: Partial<DrawerTokens>;
  /** Spring for the slide, or `false`. Defaults to the theme's `gentle`. */
  motion?: MotionOverride;
  testID?: string;
}

export interface DrawerTokens {
  background: string;
  blanket: string;
  /** Native sheet corner radius. */
  radius: number;
  padding: number;
  handle: string;
  titleColor: string;
  shadow: string;
}

export const drawerWidths: Record<DrawerWidth, number | string> = {
  narrow: 360,
  medium: 480,
  wide: 600,
  extended: '95vw',
};

export function getDrawerTokens(theme: Theme): DrawerTokens {
  return {
    background: theme.color['elevation.surface.overlay'],
    blanket: theme.color['color.blanket'],
    radius: theme.radius.xxlarge,
    padding: 24,
    handle: theme.color['color.border.bold'],
    titleColor: theme.color['color.text'],
    shadow:
      theme.mode === 'dark'
        ? '0 0 0 1px #BCD6F01F, 0 8px 12px #0304048F'
        : '0 8px 24px #1E1F2133, 0 0 1px #1E1F214F',
  };
}

/** Native: drag past this fraction of the sheet's height (or fling) to close. */
export const DISMISS_FRACTION = 0.3;
export const DISMISS_VELOCITY = 800;
