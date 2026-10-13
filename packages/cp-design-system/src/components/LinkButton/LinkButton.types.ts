import type { ButtonProps } from '../Button/Button.types';

export interface LinkButtonProps extends Omit<ButtonProps, 'type' | 'isSelected'> {
  /** Where the link goes. On native it opens with `Linking` unless you pass `onPress`. */
  href: string;
  /** Web only, e.g. `'_blank'` (which also adds `rel="noopener noreferrer"`). */
  target?: string;
  /** Web only. */
  rel?: string;
}
