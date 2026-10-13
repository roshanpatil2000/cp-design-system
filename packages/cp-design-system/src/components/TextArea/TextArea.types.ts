import type { TextFieldTokens } from '../TextField/TextField.tokens';

export interface TextAreaProps {
  label?: string;
  /** Controlled value. Leave undefined to let the text area manage its own text. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Height in rows before typing. Defaults to 3. */
  minimumRows?: number;
  /** Grows with the text up to this height (px), then scrolls. Defaults to 240. */
  maxHeight?: number;
  /** Web only: let users drag the corner. Defaults to `'auto'` (grows on its own, no handle). */
  resize?: 'auto' | 'vertical' | 'none';
  /** Shows a remaining-characters counter and stops input at the limit. */
  maxCharacters?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  isMonospaced?: boolean;
  helperMessage?: string;
  errorMessage?: string;
  validMessage?: string;
  /** Web only: form field name. */
  name?: string;
  /** TextField tokens for this instance (border, colors, padding…). */
  tokens?: Partial<TextFieldTokens>;
  testID?: string;
}

/** Vertical padding that keeps one row the same height as a 40px TextField. */
export const textAreaPaddingY = (t: TextFieldTokens) =>
  Math.max(4, (t.height - t.lineHeight) / 2 - t.borderWidth);

export function remainingText(max: number | undefined, length: number) {
  if (max === undefined) return null;
  const left = max - length;
  return left === 1 ? '1 character remaining' : `${left} characters remaining`;
}
