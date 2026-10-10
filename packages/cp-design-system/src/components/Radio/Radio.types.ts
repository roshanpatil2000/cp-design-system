import type { MotionOverride } from '../../theme/types';
import type { RadioTokens } from './Radio.tokens';

export interface RadioProps {
  /** Visible label, also used as the accessible name. */
  label: string;
  /** The value reported to `onChange` when this radio is selected. */
  value: string;
  isChecked?: boolean;
  /** Called with `value` when the radio is selected. */
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  /** Web only: radios with the same name form a group (arrow keys move between them). */
  name?: string;
  /** Override any style token for this instance. */
  tokens?: Partial<RadioTokens>;
  /** Spring for this instance, or `false` for no animation. Defaults to the theme's `snappy`. */
  motion?: MotionOverride;
  testID?: string;
}

export interface RadioOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  /** Controlled selection. Leave undefined to let the group manage its own state. */
  value?: string | null;
  /** Initial selection when uncontrolled. */
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  /** Accessible name for the group, e.g. the question being asked. */
  label?: string;
  /** Defaults to `'vertical'`. */
  direction?: 'vertical' | 'horizontal';
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  /** Web only: form field name. A unique one is generated when left out. */
  name?: string;
  /** Token overrides applied to every radio in the group. */
  tokens?: Partial<RadioTokens>;
  motion?: MotionOverride;
  /** Each radio gets `${testID}-${value}`. */
  testID?: string;
}
