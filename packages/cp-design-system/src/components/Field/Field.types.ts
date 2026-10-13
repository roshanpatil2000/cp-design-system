import type { ReactNode } from 'react';

/** Props to spread onto your control so it's wired to the label and message (web). */
export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  isInvalid: boolean;
  isRequired: boolean;
  isDisabled: boolean;
}

export interface FieldProps {
  label: string;
  /** The control, or a function receiving the props that link it to the label and message. */
  children: ReactNode | ((field: FieldControlProps) => ReactNode);
  isRequired?: boolean;
  isDisabled?: boolean;
  /** Shows `errorMessage` instead of the helper text. */
  isInvalid?: boolean;
  helperMessage?: string;
  errorMessage?: string;
  validMessage?: string;
  testID?: string;
}
