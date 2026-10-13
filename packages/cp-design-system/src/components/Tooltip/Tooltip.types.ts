import type { ReactElement } from 'react';
import type { MotionOverride, Theme } from '../../theme/types';

export interface TooltipProps {
  /** Short text shown on hover or focus (web) and on long-press (native). */
  content: string;
  /** The element the tooltip describes. */
  children: ReactElement;
  /** Defaults to `'top'`; flips when there's no room. */
  position?: 'top' | 'bottom';
  /** Web: milliseconds of hover before showing. Defaults to 300. */
  delay?: number;
  tokens?: Partial<TooltipTokens>;
  motion?: MotionOverride;
  testID?: string;
}

export interface TooltipTokens {
  background: string;
  text: string;
  radius: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  lineHeight: number;
  fontFamily?: string;
  maxWidth: number;
  offset: number;
}

export function getTooltipTokens(theme: Theme): TooltipTokens {
  return {
    background: theme.color['color.background.neutral.bold'],
    text: theme.color['color.text.inverse'],
    radius: theme.radius.small,
    paddingX: 6,
    paddingY: 2,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: theme.fontFamily.body,
    maxWidth: 240,
    offset: 8,
  };
}

/** Native: how long a long-press must last, and how long the tooltip stays after release. */
export const LONG_PRESS_MS = 500;
export const LINGER_MS = 1500;
