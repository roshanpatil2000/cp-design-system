import type { ReactNode } from 'react';
import type { MotionOverride } from '../../theme/types';
import type { ButtonTokens } from '../Button/Button.tokens';
import type { ButtonAppearance, ButtonSpacing } from '../Button/Button.types';
import type { IconGlyph } from '../Icon/Icon.types';

export interface IconButtonProps {
  /** A built-in glyph, or a function that draws your own icon in the button's color and size. */
  icon: IconGlyph | ((props: { color: string; size: number }) => ReactNode);
  /** Accessible name. Required: an icon alone doesn't say what the button does. */
  label: string;
  /** Native: extra spoken help. Tooltip sets this for you. */
  accessibilityHint?: string;
  onPress?: () => void;
  /** Defaults to `'default'`. */
  appearance?: ButtonAppearance;
  /** `'default'` 32×32 or `'compact'` 24×24. */
  spacing?: ButtonSpacing;
  /** `'circle'` for floating or avatar-style actions. Defaults to `'square'`. */
  shape?: 'square' | 'circle';
  isSelected?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  /** Button tokens for this instance. */
  tokens?: Partial<ButtonTokens>;
  motion?: MotionOverride;
  testID?: string;
}

/** Square padding so the button is exactly as wide as it is tall. */
export function iconButtonTokens(p: IconButtonProps): Partial<ButtonTokens> {
  const compact = p.spacing === 'compact';
  return {
    paddingX: compact ? 6 : 8,
    ...(p.shape === 'circle' ? { radius: 9999 } : {}),
    ...p.tokens,
  };
}
