import type { MotionOverride } from '../../theme/types';
import type { ToggleTokens } from './Toggle.tokens';

export type ToggleSize = 'regular' | 'large';
/** `success` is Atlassian's green; `brand` uses your theme's brand color. */
export type ToggleAppearance = 'success' | 'brand';

export interface ToggleProps {
  /** Accessible name, read by screen readers. Render a visible label next to the toggle yourself. */
  label: string;
  /** Controlled checked state. Leave undefined to let the toggle manage its own state. */
  isChecked?: boolean;
  /** Initial state when uncontrolled. Defaults to `false`. */
  defaultChecked?: boolean;
  /** Called with the new state after a tap, click, drag, keypress or screen reader action. */
  onChange?: (checked: boolean) => void;
  /** Defaults to `'regular'` (32×16). `'large'` is 40×20. */
  size?: ToggleSize;
  /** Checked color. Defaults to `'success'` (Atlassian green). */
  appearance?: ToggleAppearance;
  isDisabled?: boolean;
  /** Shows a pulsing thumb and ignores input until the operation finishes. */
  isLoading?: boolean;
  /** Web only: submits `value` under this name with a form when checked. */
  name?: string;
  /** Web only: the submitted value when checked. Defaults to `'on'`. */
  value?: string;
  /** Override any style token for this instance. */
  tokens?: Partial<ToggleTokens>;
  /** Spring for this instance, or `false` for no animation. Defaults to the theme's `snappy`. */
  motion?: MotionOverride;
  testID?: string;
}
