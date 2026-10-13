import type { ReactNode } from 'react';
import type { MotionOverride } from '../../theme/types';
import type { ButtonSpacing } from '../Button/Button.types';

export interface SplitButtonItem {
  label: string;
  onPress: () => void;
  isDisabled?: boolean;
}

export interface SplitButtonProps {
  /** Label of the main action. */
  children: ReactNode;
  /** The main action. */
  onPress?: () => void;
  /** Secondary actions in the dropdown. */
  items: SplitButtonItem[];
  /** Defaults to `'default'`. */
  appearance?: 'default' | 'primary';
  spacing?: ButtonSpacing;
  isDisabled?: boolean;
  /** Shows a spinner on the main action. */
  isLoading?: boolean;
  /** Accessible name of the dropdown button. Defaults to `'More actions'`. */
  menuLabel?: string;
  motion?: MotionOverride;
  testID?: string;
}

/** Joined-button styling: square inner corners and an inset focus ring that isn't clipped. */
export const joinedTokens = { radius: 0, focusRingGap: -2 } as const;
