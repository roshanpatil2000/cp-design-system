import type { ButtonProps } from '../components/Button/Button.types';
import type { ButtonTokens } from '../components/Button/Button.tokens';
import type { CheckboxProps } from '../components/Checkbox/Checkbox.types';
import type { CheckboxTokens } from '../components/Checkbox/Checkbox.tokens';
import type { FlagProviderProps } from '../components/Flag/Flag.types';
import type { FlagTokens } from '../components/Flag/Flag.tokens';
import type { ModalProps } from '../components/Modal/Modal.types';
import type { ModalTokens } from '../components/Modal/Modal.tokens';
import type { RadioGroupProps, RadioProps } from '../components/Radio/Radio.types';
import type { RadioTokens } from '../components/Radio/Radio.tokens';
import type { TextFieldProps } from '../components/TextField/TextField.types';
import type { TextFieldTokens } from '../components/TextField/TextField.tokens';
import type { ToggleProps } from '../components/Toggle/Toggle.types';
import type { ToggleTokens } from '../components/Toggle/Toggle.tokens';
import type { ColorToken } from '../tokens/atlassian/colors.generated';
import type { atlassianOpacity } from '../tokens/atlassian/colors.generated';
import type { atlassianSpace } from '../tokens/atlassian/spacing.generated';
import type { atlassianBorderWidth, atlassianRadius } from '../tokens/atlassian/shape.generated';
import type { atlassianTextStyles } from '../tokens/atlassian/typography.generated';
import type {
  Bezier,
  atlassianDurations,
  atlassianEasings,
  atlassianInteractions,
} from '../tokens/atlassian/motion.generated';

export type ColorMode = 'light' | 'dark';

/** Atlassian's semantic colors plus readable foregrounds for bold brand surfaces. */
export type ThemeColors = Record<ColorToken | 'color.text.onBrand' | 'color.icon.onBrand', string>;
export type ThemeColor = keyof ThemeColors;

export type SpaceToken = keyof typeof atlassianSpace;
export type RadiusToken = keyof typeof atlassianRadius;
export type TextStyleName = keyof typeof atlassianTextStyles;

export interface TextStyle {
  fontSize: number;
  lineHeight: number;
  /** Numeric weight (Atlassian uses 653 for bold). Use `fontWeightFor()` on native. */
  fontWeight: number;
}

export interface FontFamilies {
  /** Undefined means the platform's system font. */
  body?: string;
  heading?: string;
  code?: string;
}

/** Physical spring, understood by both Reanimated (native) and Motion (web). */
export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export type SpringName = 'snappy' | 'gentle' | 'bouncy';

export interface ThemeMotion {
  /** Milliseconds. */
  durations: Record<keyof typeof atlassianDurations, number>;
  easings: Record<keyof typeof atlassianEasings, Bezier>;
  /** Atlassian's per-interaction timings, e.g. `button.pressed`. */
  interactions: typeof atlassianInteractions;
  springs: Record<SpringName, SpringConfig>;
}

/** Per-component customization: default props, token overrides and motion. */
export interface ComponentTheme<Props, Tokens> {
  defaultProps?: Partial<Props>;
  /** Overrides for the component's style tokens, or a function of the active theme. */
  tokens?: Partial<Tokens> | ((theme: Theme) => Partial<Tokens>);
  /** Spring used by the component's animations, or `false` to make them instant. */
  motion?: MotionOverride;
}

/**
 * Component customizations by component name. Each component adds its own entry here
 * as it is built.
 */
export interface ComponentThemes {
  Button?: ComponentTheme<ButtonProps, ButtonTokens>;
  Checkbox?: ComponentTheme<CheckboxProps, CheckboxTokens>;
  /** Flag tokens apply to every appearance; use a function of the theme to vary them. */
  Flag?: ComponentTheme<FlagProviderProps, FlagTokens>;
  Modal?: ComponentTheme<ModalProps, ModalTokens>;
  Radio?: ComponentTheme<RadioProps, RadioTokens>;
  /** Only `defaultProps` apply; style radios through `Radio`. */
  RadioGroup?: Pick<ComponentTheme<RadioGroupProps, never>, 'defaultProps'>;
  TextField?: ComponentTheme<TextFieldProps, TextFieldTokens>;
  Toggle?: ComponentTheme<ToggleProps, ToggleTokens>;
}

export type MotionOverride = false | SpringName | SpringConfig;

export interface Theme {
  name: string;
  mode: ColorMode;
  color: ThemeColors;
  space: typeof atlassianSpace;
  radius: Record<RadiusToken, number>;
  borderWidth: typeof atlassianBorderWidth;
  opacity: typeof atlassianOpacity;
  text: Record<TextStyleName, TextStyle>;
  fontFamily: FontFamilies;
  motion: ThemeMotion;
  components: ComponentThemes;
}

/** A light and dark pair, as created by `createTheme`. */
export interface ThemePair {
  light: Theme;
  dark: Theme;
}
