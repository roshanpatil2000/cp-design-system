import type { ReactNode } from 'react';
import type { MotionOverride } from '../../theme/types';
import type { FlagTokens } from './Flag.tokens';

export type FlagAppearance = 'normal' | 'info' | 'success' | 'warning' | 'error';
export type FlagIcon = 'info' | 'success' | 'warning' | 'error';

export interface FlagAction {
  content: string;
  onPress: () => void;
}

export interface FlagOptions {
  /** Pass your own id to update or dismiss the flag later. Generated when left out. */
  id?: string;
  title: string;
  description?: string;
  /** `'normal'` is a light surface; the others are bold colors. Defaults to `'normal'`. */
  appearance?: FlagAppearance;
  /** Status icon before the title, or `false` for none. Defaults to the appearance's icon. */
  icon?: FlagIcon | false;
  /** Up to a few short actions shown under the description. */
  actions?: FlagAction[];
  /** Dismiss automatically after the provider's `autoDismissDuration`. Defaults to `true`. */
  isAutoDismiss?: boolean;
  /** Called once the flag has been dismissed by any means. */
  onDismissed?: (id: string) => void;
}

export interface FlagApi {
  /** Shows a flag and returns its id. Showing an id that is already visible replaces it. */
  showFlag: (options: FlagOptions) => string;
  dismissFlag: (id: string) => void;
  dismissAllFlags: () => void;
}

export interface FlagProviderProps {
  children?: ReactNode;
  /** Milliseconds before auto-dismissing flags leave. Defaults to 8000 (Atlassian's value). */
  autoDismissDuration?: number;
  /** Most flags visible at once; older ones are dismissed. Defaults to 5. */
  maxFlags?: number;
  /** Accessible name of the notifications region. Defaults to `'Notifications'`. */
  label?: string;
  /** Token overrides for every flag. */
  tokens?: Partial<FlagTokens>;
  /** Spring for drags and stacking, or `false` for no animation. */
  motion?: MotionOverride;
  /** Each flag gets `${testID}-${id}`. Defaults to `'flag'`. */
  testID?: string;
}
