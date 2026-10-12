import type { ReactNode } from 'react';
import type { MotionOverride, SpaceToken, Theme } from '../../theme/types';
import type { StyleObject } from '../Box/Box.types';

export interface PressableState {
  hovered: boolean;
  pressed: boolean;
  focused: boolean;
}

export interface PressableProps {
  /** Content, or a function of the interaction state for state-dependent styling. */
  children?: ReactNode | ((state: PressableState) => ReactNode);
  onPress?: () => void;
  isDisabled?: boolean;
  /** Accessible name when the content isn't text. */
  accessibilityLabel?: string;
  /** Defaults to `'button'`. */
  role?: 'button' | 'link';
  padding?: SpaceToken;
  /** Applied last, after the token styles. */
  style?: StyleObject;
  tokens?: Partial<PressableTokens>;
  /** Spring for the press scale, or `false` for none. Defaults to the theme's `snappy`. */
  motion?: MotionOverride;
  testID?: string;
}

/** The shared press, hover and focus treatment. Override per theme or per instance. */
export interface PressableTokens {
  background: string;
  backgroundHovered: string;
  backgroundPressed: string;
  /** Scale while pressed; 1 turns the squish off. */
  pressedScale: number;
  radius: number;
  focusRing: string;
  focusRingWidth: number;
  /** Opacity while disabled. */
  disabledOpacity: number;
}

export function getPressableTokens(theme: Theme): PressableTokens {
  const c = theme.color;
  return {
    background: c['color.background.neutral.subtle'],
    backgroundHovered: c['color.background.neutral.subtle.hovered'],
    backgroundPressed: c['color.background.neutral.subtle.pressed'],
    pressedScale: 0.97,
    radius: theme.radius.small,
    focusRing: c['color.border.focused'],
    focusRingWidth: theme.borderWidth.focused,
    disabledOpacity: theme.opacity.disabled,
  };
}

export function pressableBackground(t: PressableTokens, s: PressableState) {
  return s.pressed ? t.backgroundPressed : s.hovered ? t.backgroundHovered : t.background;
}
