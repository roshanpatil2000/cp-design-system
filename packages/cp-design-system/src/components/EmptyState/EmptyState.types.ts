import type { ReactNode } from 'react';
import type { MotionOverride } from '../../theme/types';

export interface EmptyStateProps {
  header: string;
  description?: ReactNode;
  /** An illustration or icon above the header. */
  image?: ReactNode;
  /** Usually a primary Button. */
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  /** A link-style action under the buttons. */
  tertiaryAction?: ReactNode;
  /** `'narrow'` 304px or `'wide'` 464px. Defaults to `'wide'`. */
  width?: 'narrow' | 'wide';
  /** Shows a spinner next to the actions while they work. */
  isLoading?: boolean;
  /** Content rises in on mount; `false` turns it off. */
  motion?: MotionOverride;
  testID?: string;
}

export const emptyStateWidths = { narrow: 304, wide: 464 } as const;
