import type { ReactNode } from 'react';
import type { MotionOverride } from '../../theme/types';
import type { ButtonTokens } from './Button.tokens';

export type ButtonAppearance =
  'default' | 'primary' | 'subtle' | 'warning' | 'danger' | 'discovery';
export type ButtonSpacing = 'default' | 'compact';

/**
 * An icon slot. Pass an element, or a function that receives the button's current text color
 * and icon size, so icons always match the appearance and state.
 */
export type ButtonIcon = ReactNode | ((props: { color: string; size: number }) => ReactNode);

export interface ButtonProps {
  /** The label. Plain text is styled for you; any other node is rendered as is. */
  children: ReactNode;
  /** Called on click (web), tap (native) and Enter/Space. Not called while disabled or loading. */
  onPress?: () => void;
  /** Defaults to `'default'`. */
  appearance?: ButtonAppearance;
  /** `'default'` is 32px tall, `'compact'` is 24px. */
  spacing?: ButtonSpacing;
  isDisabled?: boolean;
  /** Shows a spinner in place of the label (keeping the width) and ignores presses. Stays focusable. */
  isLoading?: boolean;
  /** Pressed-in / toggled-on look, e.g. for toolbar buttons. Exposed to assistive tech. */
  isSelected?: boolean;
  /** Stretch to the width of the container. */
  shouldFitContainer?: boolean;
  iconBefore?: ButtonIcon;
  iconAfter?: ButtonIcon;
  /** Accessible name when the visible label isn't enough (e.g. icon-only content). */
  accessibilityLabel?: string;
  /** Web only. Defaults to `'button'`. */
  type?: 'button' | 'submit' | 'reset';
  /** Override any style token for this instance. */
  tokens?: Partial<ButtonTokens>;
  /** Spring for the press animation, or `false` for none. Defaults to the theme's `snappy`. */
  motion?: MotionOverride;
  testID?: string;
}
