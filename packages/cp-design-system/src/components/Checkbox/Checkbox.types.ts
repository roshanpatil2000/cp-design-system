import type { MotionOverride } from '../../theme/types';
import type { CheckboxTokens } from './Checkbox.tokens';

export interface CheckboxProps {
  /** Visible label, also used as the accessible name. */
  label: string;
  /** Controlled checked state. Leave undefined to let the checkbox manage its own state. */
  isChecked?: boolean;
  /** Initial state when uncontrolled. Defaults to `false`. */
  defaultChecked?: boolean;
  /** Shows a dash, for "some but not all" selections. A press reports `true`. */
  isIndeterminate?: boolean;
  /** Called with the new state after a click, tap, Space or screen reader action. */
  onChange?: (checked: boolean) => void;
  isDisabled?: boolean;
  /** Red border, and `aria-invalid` for assistive tech. */
  isInvalid?: boolean;
  /** Adds a red asterisk after the label and marks the input required. */
  isRequired?: boolean;
  /** Web only: submits `value` under this name with a form when checked. */
  name?: string;
  /** Web only: the submitted value when checked. Defaults to `'on'`. */
  value?: string;
  /** Override any style token for this instance. */
  tokens?: Partial<CheckboxTokens>;
  /** Spring for this instance, or `false` for no animation. Defaults to the theme's `snappy`. */
  motion?: MotionOverride;
  testID?: string;
}
