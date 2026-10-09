export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonTone = 'primary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Button label. */
  children: string;
  /** Called on click (web) or press (native). */
  onPress?: () => void;
  /** Defaults to `'solid'`. */
  variant?: ButtonVariant;
  /** Defaults to `'primary'`. */
  tone?: ButtonTone;
  /** Defaults to `'md'`. */
  size?: ButtonSize;
  disabled?: boolean;
  /** Stretch to the container's width. */
  fullWidth?: boolean;
  /** Accessible label when the visible text isn't descriptive enough. */
  accessibilityLabel?: string;
  testID?: string;
}
