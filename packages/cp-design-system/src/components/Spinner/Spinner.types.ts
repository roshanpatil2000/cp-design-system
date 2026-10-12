import type { Theme } from '../../theme/types';

export type SpinnerSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export interface SpinnerProps {
  /** `'xsmall'` 8, `'small'` 16, `'medium'` 24, `'large'` 48, `'xlarge'` 96, or a number. Defaults to `'medium'`. */
  size?: SpinnerSize | number;
  /** `'inherit'` for normal surfaces, `'invert'` for bold or dark ones. Defaults to `'inherit'`. */
  appearance?: 'inherit' | 'invert';
  /** Any color; overrides `appearance`. */
  color?: string;
  /** Accessible name. Defaults to `'Loading'`; `false` hides it (when the parent already says it's busy). */
  label?: string | false;
  testID?: string;
}

export const spinnerSizes: Record<SpinnerSize, number> = {
  xsmall: 8,
  small: 16,
  medium: 24,
  large: 48,
  xlarge: 96,
};

export function spinnerColor(theme: Theme, p: SpinnerProps) {
  return (
    p.color ??
    (p.appearance === 'invert'
      ? theme.color['color.icon.inverse']
      : theme.color['color.icon.subtle'])
  );
}

export const spinnerPx = (size: SpinnerProps['size']) =>
  typeof size === 'number' ? size : spinnerSizes[size ?? 'medium'];
