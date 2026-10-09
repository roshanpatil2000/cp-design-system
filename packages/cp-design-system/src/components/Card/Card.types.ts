import type { ReactNode } from 'react';
import type { SpacingToken } from '../../tokens';

export interface CardProps {
  children?: ReactNode;
  /** Inner padding (spacing token). Defaults to `4` (16px). */
  padding?: SpacingToken;
  /** Show a drop shadow. Defaults to `true`. */
  elevated?: boolean;
  testID?: string;
}
