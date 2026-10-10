import type { ReactNode } from 'react';
import type { MotionOverride } from '../../theme/types';
import type { TextFieldTokens } from './TextField.tokens';

export type TextFieldAppearance = 'standard' | 'subtle' | 'none';
export type TextFieldWidth = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | number;
/** Picks the keyboard on native and the input type on the web. */
export type TextFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

export interface TextFieldProps {
  /** Visible label above the field. Without it, pass `accessibilityLabel`. */
  label?: string;
  /** Accessible name when there is no visible label. */
  accessibilityLabel?: string;
  /** Controlled value. Leave undefined to let the field manage its own text. */
  value?: string;
  /** Initial text when uncontrolled. */
  defaultValue?: string;
  /** Called with the new text on every change (both platforms). */
  onChange?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /** Enter on the web, the return key on native. */
  onSubmit?: () => void;
  placeholder?: string;
  /** Defaults to `'text'`. */
  type?: TextFieldType;
  /** Defaults to `'standard'` (bordered). `'subtle'` shows a border on hover and focus; `'none'` never does. */
  appearance?: TextFieldAppearance;
  /** 32px tall instead of 40px. */
  isCompact?: boolean;
  isDisabled?: boolean;
  /** Red border and error message. Becoming invalid shakes the field (unless motion is reduced). */
  isInvalid?: boolean;
  isReadOnly?: boolean;
  /** Shows a red asterisk after the label and marks the field required. */
  isRequired?: boolean;
  /** Uses the theme's code font. */
  isMonospaced?: boolean;
  /** Hint below the field. Hidden while an error or valid message shows. */
  helperMessage?: string;
  /** Shown below the field while `isInvalid` is true. */
  errorMessage?: string;
  /** Success message shown when not invalid. */
  validMessage?: string;
  /** Shows a "N characters remaining" counter. Typing past it is allowed but flagged as an error. */
  maxCharacters?: number;
  /** Flags the counter until at least this many characters are entered. */
  minCharacters?: number;
  /** Content inside the field before the input, e.g. an icon. */
  elemBeforeInput?: ReactNode;
  /** Content inside the field after the input, e.g. a clear button. */
  elemAfterInput?: ReactNode;
  /** Atlassian width preset or a number of px. Defaults to the full available width. */
  width?: TextFieldWidth;
  /** Web only: form field name. */
  name?: string;
  /** Autofill hint, e.g. `'email'`, `'current-password'`, `'one-time-code'`. */
  autoComplete?: string;
  autoFocus?: boolean;
  /** Override any style token for this instance. */
  tokens?: Partial<TextFieldTokens>;
  /** Spring for the error shake, or `false` for none. Color transitions follow Atlassian's timing. */
  motion?: MotionOverride;
  testID?: string;
}
