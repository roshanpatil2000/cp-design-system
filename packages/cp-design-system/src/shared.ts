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
