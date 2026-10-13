import type { MotionOverride } from '../../theme/types';
import type { MenuOption } from '../internal/menuTokens';
import type { TextFieldTokens } from '../TextField/TextField.tokens';

export type SelectOption = MenuOption;

export interface SelectProps {
  options: SelectOption[];
  /** Controlled selection. Leave undefined to let the select manage its own value. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  label?: string;
  /** Shown when nothing is selected. Defaults to `'Select…'`. */
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  helperMessage?: string;
  errorMessage?: string;
  validMessage?: string;
  /** Pixels, or full width when left out. */
  width?: number;
  /** Web only: submits the value with forms under this name. */
  name?: string;
  /** TextField tokens for the trigger (border, colors, height…). */
  tokens?: Partial<TextFieldTokens>;
  /** Spring for the chevron, or `false`. */
  motion?: MotionOverride;
  testID?: string;
}
