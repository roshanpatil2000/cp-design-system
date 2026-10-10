import type { Theme } from '../../theme/types';
import type { TextFieldAppearance, TextFieldWidth } from './TextField.types';

/** Every visual value the TextField uses. Override any of them per theme or per instance. */
export interface TextFieldTokens {
  /** Field height in px (40, or 32 compact). Vertical padding is derived from it. */
  height: number;
  paddingX: number;
  radius: number;
  borderWidth: number;
  fontSize: number;
  lineHeight: number;
  fontFamily?: string;
  monoFontFamily?: string;
  background: string;
  backgroundHovered: string;
  backgroundFocused: string;
  backgroundDisabled: string;
  border: string;
  borderHovered: string;
  borderFocused: string;
  borderInvalid: string;
  borderDisabled: string;
  text: string;
  textDisabled: string;
  placeholder: string;
  placeholderDisabled: string;
  labelColor: string;
  labelFontSize: number;
  labelLineHeight: number;
  labelFontWeight: number;
  requiredColor: string;
  messageFontSize: number;
  messageLineHeight: number;
  helperColor: string;
  errorColor: string;
  validColor: string;
  /** Distance of the error shake in px. 0 turns it off. */
  shakeDistance: number;
}

/** Atlassian's text field width presets. */
export const textFieldWidths: Record<Exclude<TextFieldWidth, number>, number> = {
  xsmall: 80,
  small: 160,
  medium: 240,
  large: 320,
  xlarge: 480,
};

/**
 * `touch` selects Atlassian's phone sizing: 16/24 text (iOS doesn't zoom into it) with less padding,
 * so the field keeps the same 40px / 32px height. Native always uses it; the web uses it on narrow
 * touch screens.
 */
export function getTextFieldTokens(
  theme: Theme,
  appearance: TextFieldAppearance,
  isCompact: boolean,
  touch: boolean,
): TextFieldTokens {
  const c = theme.color;
  const text = touch ? theme.text['body.large'] : theme.text.body;
  const small = theme.text['body.small'];
  // Colors from Atlassian's Textfield and Form (label, messages, character counter).
  const standard = appearance === 'standard';
  const bordered = appearance !== 'none';
  return {
    height: isCompact ? 32 : 40,
    paddingX: theme.space['075'],
    radius: theme.radius.medium,
    borderWidth: theme.borderWidth.default,
    fontSize: text.fontSize,
    lineHeight: text.lineHeight,
    fontFamily: theme.fontFamily.body,
    monoFontFamily: theme.fontFamily.code,
    background: standard ? c['color.background.input'] : 'transparent',
    backgroundHovered: bordered ? c['color.background.input.hovered'] : 'transparent',
    backgroundFocused: bordered ? c['color.background.input.pressed'] : 'transparent',
    backgroundDisabled: standard ? c['color.background.disabled'] : 'transparent',
    border: standard ? c['color.border.input'] : 'transparent',
    borderHovered: bordered ? c['color.border.input'] : 'transparent',
    borderFocused: bordered ? c['color.border.focused'] : 'transparent',
    borderInvalid: c['color.border.danger'],
    borderDisabled: standard ? c['color.background.disabled'] : 'transparent',
    text: c['color.text'],
    textDisabled: c['color.text.disabled'],
    placeholder: c['color.text.subtlest'],
    placeholderDisabled: c['color.text.disabled'],
    labelColor: c['color.text.subtle'],
    labelFontSize: small.fontSize,
    labelLineHeight: small.lineHeight,
    labelFontWeight: theme.text['heading.xsmall'].fontWeight,
    requiredColor: c['color.text.danger'],
    messageFontSize: small.fontSize,
    messageLineHeight: small.lineHeight,
    helperColor: c['color.text.subtlest'],
    errorColor: c['color.text.danger'],
    validColor: c['color.text.success'],
    shakeDistance: 4,
  };
}

/** Vertical padding that centres one line of text in the field (1px border + 1px inset each side). */
export const textFieldPaddingY = (t: TextFieldTokens) =>
  Math.max(0, (t.height - t.lineHeight - 4 * t.borderWidth) / 2);
