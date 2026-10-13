import type { ReactNode } from 'react';
import type { MotionOverride, Theme } from '../../theme/types';
import type { Placement } from '../internal/placement';

export type PopupPlacement = Placement;

export interface PopupProps {
  isOpen: boolean;
  /** Called on Escape, a click or tap outside, and Android back. */
  onClose: () => void;
  /** What the popup is anchored to, usually a Button that toggles `isOpen`. */
  trigger: ReactNode;
  content: ReactNode;
  /** Defaults to `'bottom-start'`. Flips to the other side when there's no room. */
  placement?: PopupPlacement;
  /** Accessible name of the popup. */
  label?: string;
  /** Defaults to `'dialog'`. */
  role?: 'dialog' | 'region';
  /** Web: move focus into the popup when it opens. Defaults to `true`. */
  shouldFocusContent?: boolean;
  /** Fixed width in px; otherwise the content decides. */
  width?: number;
  tokens?: Partial<PopupTokens>;
  /** `false` turns the open animation off. */
  motion?: MotionOverride;
  testID?: string;
}

export interface PopupTokens {
  background: string;
  radius: number;
  /** Gap between the trigger and the popup. */
  offset: number;
  shadow: string;
  /** Padding around the content (0 for Popup; InlineDialog adds its own). */
  padding: number;
  maxWidth: number;
}

export function getPopupTokens(theme: Theme): PopupTokens {
  return {
    background: theme.color['elevation.surface.overlay'],
    radius: theme.radius.medium,
    offset: 8,
    shadow:
      theme.mode === 'dark'
        ? '0 0 0 1px #BCD6F01F, 0 8px 12px #0304048F, 0 0 1px #03040480'
        : '0 8px 12px #1E1F2126, 0 0 1px #1E1F214F',
    padding: 0,
    maxWidth: 480,
  };
}
