// Platform-agnostic exports, re-exported by both index.web.ts and index.native.ts.
export * from './tokens';

export {
  createTheme,
  atlassianTheme,
  atlassianWebFontFamilies,
  defaultSprings,
  fontWeightFor,
} from './theme/createTheme';
export type { ThemeOptions } from './theme/createTheme';
export { createBrandRamp, readableTextOn } from './theme/brand';
export type { BrandRamp } from './theme/brand';
export { contrastRatio } from './theme/color';
export { useTheme, useReducedMotion, useHaptics } from './theme/context';
export type {
  ThemeProviderProps,
  ColorModePreference,
  MotionPreference,
  HapticEvent,
  HapticsAdapter,
} from './theme/context';
export { resolveTokens, resolveSpring } from './theme/component';

export type {
  ButtonProps,
  ButtonAppearance,
  ButtonSpacing,
  ButtonIcon,
} from './components/Button/Button.types';
export type { ButtonTokens } from './components/Button/Button.tokens';
export { getButtonTokens } from './components/Button/Button.tokens';
export type {
  TextFieldProps,
  TextFieldAppearance,
  TextFieldType,
  TextFieldWidth,
} from './components/TextField/TextField.types';
export type { TextFieldTokens } from './components/TextField/TextField.tokens';
export { getTextFieldTokens, textFieldWidths } from './components/TextField/TextField.tokens';
export type { ToggleProps, ToggleSize, ToggleAppearance } from './components/Toggle/Toggle.types';
export type { ToggleTokens } from './components/Toggle/Toggle.tokens';
export { getToggleTokens } from './components/Toggle/Toggle.tokens';
export type { CheckboxProps } from './components/Checkbox/Checkbox.types';
export type { CheckboxTokens } from './components/Checkbox/Checkbox.tokens';
export { getCheckboxTokens } from './components/Checkbox/Checkbox.tokens';
export type { RadioProps, RadioGroupProps, RadioOption } from './components/Radio/Radio.types';
export type { RadioTokens } from './components/Radio/Radio.tokens';
export { getRadioTokens } from './components/Radio/Radio.tokens';
export type {
  FlagOptions,
  FlagAppearance,
  FlagIcon,
  FlagAction,
  FlagApi,
  FlagProviderProps,
} from './components/Flag/Flag.types';
export type { FlagTokens } from './components/Flag/Flag.tokens';
export { getFlagTokens } from './components/Flag/Flag.tokens';
export { useFlags } from './components/Flag/flagContext';
export type { ModalProps, ModalWidth, ModalAppearance } from './components/Modal/Modal.types';
export type { ModalTokens } from './components/Modal/Modal.tokens';
export { getModalTokens, modalWidths } from './components/Modal/Modal.tokens';
export type {
  Theme,
  ThemePair,
  ThemeColors,
  ThemeColor,
  ColorMode,
  SpaceToken,
  RadiusToken,
  TextStyleName,
  TextStyle,
  FontFamilies,
  SpringConfig,
  SpringName,
  ThemeMotion,
  ComponentTheme,
  ComponentThemes,
  MotionOverride,
} from './theme/types';
