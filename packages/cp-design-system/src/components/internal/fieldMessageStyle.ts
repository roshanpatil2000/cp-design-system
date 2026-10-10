import type { Theme } from '../../theme/types';
import type { StatusKind } from './statusIconLayout';

export type FieldMessageKind = 'helper' | 'error' | 'valid';
export interface FieldMessageValue {
  kind: FieldMessageKind;
  text: string;
}

/** Overrides for message styling; anything left out comes from the theme (Atlassian form styles). */
export interface FieldMessageStyle {
  helperColor?: string;
  errorColor?: string;
  validColor?: string;
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: string;
}

export function resolveFieldMessageStyle(theme: Theme, style: FieldMessageStyle = {}) {
  return {
    helperColor: style.helperColor ?? theme.color['color.text.subtlest'],
    errorColor: style.errorColor ?? theme.color['color.text.danger'],
    validColor: style.validColor ?? theme.color['color.text.success'],
    fontSize: style.fontSize ?? theme.text['body.small'].fontSize,
    lineHeight: style.lineHeight ?? theme.text['body.small'].lineHeight,
    fontFamily: style.fontFamily ?? theme.fontFamily.body,
    glyph: theme.color['color.icon.inverse'],
  };
}

export const messageIconKind: Record<FieldMessageKind, StatusKind | null> = {
  helper: null,
  error: 'error',
  valid: 'success',
};
