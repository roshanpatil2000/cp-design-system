import type { TextFieldTokens } from '../TextField/TextField.tokens';
import type { FieldMessageValue } from './fieldMessageStyle';

export type FieldLabelTokens = Pick<
  TextFieldTokens,
  | 'labelColor'
  | 'labelFontSize'
  | 'labelLineHeight'
  | 'labelFontWeight'
  | 'requiredColor'
  | 'fontFamily'
  | 'helperColor'
  | 'errorColor'
  | 'validColor'
>;

/** Which message a field shows: the error when invalid, else valid, else helper. */
export function pickFieldMessage(p: {
  isInvalid?: boolean;
  errorMessage?: string;
  validMessage?: string;
  helperMessage?: string;
}): FieldMessageValue | null {
  if (p.isInvalid && p.errorMessage) return { kind: 'error', text: p.errorMessage };
  if (p.validMessage) return { kind: 'valid', text: p.validMessage };
  if (p.helperMessage) return { kind: 'helper', text: p.helperMessage };
  return null;
}

export const messageStyleOf = (t: FieldLabelTokens) => ({
  helperColor: t.helperColor,
  errorColor: t.errorColor,
  validColor: t.validColor,
});
