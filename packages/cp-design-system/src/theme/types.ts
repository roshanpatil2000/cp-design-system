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
import type { BadgeProps } from '../components/Badge/Badge.types';
import type { BadgeTokens } from '../components/Badge/Badge.types';
import type { BannerProps } from '../components/Banner/Banner.types';
import type { BannerTokens } from '../components/Banner/Banner.types';
import type { EmptyStateProps } from '../components/EmptyState/EmptyState.types';
import type { LozengeProps } from '../components/Lozenge/Lozenge.types';
import type { LozengeTokens } from '../components/Lozenge/Lozenge.types';
import type { PressableProps, PressableTokens } from '../components/Pressable/Pressable.types';
import type { ProgressBarProps } from '../components/ProgressBar/ProgressBar.types';
import type { ProgressBarTokens } from '../components/ProgressBar/ProgressBar.types';
import type { ProgressIndicatorProps } from '../components/ProgressIndicator/ProgressIndicator.types';
import type { ProgressIndicatorTokens } from '../components/ProgressIndicator/ProgressIndicator.types';
import type { SectionMessageProps } from '../components/SectionMessage/SectionMessage.types';
import type { SectionMessageTokens } from '../components/SectionMessage/SectionMessage.types';
import type { SkeletonProps } from '../components/Skeleton/Skeleton.types';
import type { SkeletonTokens } from '../components/Skeleton/Skeleton.types';
import type { TagProps } from '../components/Tag/Tag.types';
import type { TagTokens } from '../components/Tag/Tag.types';
import type { AvatarProps, AvatarTokens } from '../components/Avatar/Avatar.types';
import type { AvatarGroupProps } from '../components/AvatarGroup/AvatarGroup.types';
import type { IconButtonProps } from '../components/IconButton/IconButton.types';
import type { LinkButtonProps } from '../components/LinkButton/LinkButton.types';
import type { RangeProps, RangeTokens } from '../components/Range/Range.types';
import type { SelectProps } from '../components/Select/Select.types';
import type { SplitButtonProps } from '../components/SplitButton/SplitButton.types';
import type { TextAreaProps } from '../components/TextArea/TextArea.types';
import type { DrawerProps, DrawerTokens } from '../components/Drawer/Drawer.types';
import type { DropdownMenuProps } from '../components/DropdownMenu/DropdownMenu.types';
import type { InlineDialogProps } from '../components/InlineDialog/InlineDialog.types';
import type { PaginationProps } from '../components/Pagination/Pagination.types';
import type { PopupProps, PopupTokens } from '../components/Popup/Popup.types';
import type { TabsProps, TabsTokens } from '../components/Tabs/Tabs.types';
import type { TooltipProps, TooltipTokens } from '../components/Tooltip/Tooltip.types';
import type { CarouselProps, CarouselTokens } from '../components/Carousel/Carousel.types';
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
  Carousel?: ComponentTheme<CarouselProps, CarouselTokens>;
  Drawer?: ComponentTheme<DrawerProps, DrawerTokens>;
  /** Only `defaultProps` apply; it uses Button and menu styling. */
  DropdownMenu?: Pick<ComponentTheme<DropdownMenuProps, never>, 'defaultProps'>;
  /** Tokens are Popup tokens. */
  InlineDialog?: ComponentTheme<InlineDialogProps, PopupTokens>;
  /** Only `defaultProps` apply. */
  Pagination?: Pick<ComponentTheme<PaginationProps, never>, 'defaultProps'>;
  Popup?: ComponentTheme<PopupProps, PopupTokens>;
  Tabs?: ComponentTheme<TabsProps, TabsTokens>;
  Tooltip?: ComponentTheme<TooltipProps, TooltipTokens>;
  Avatar?: ComponentTheme<AvatarProps, AvatarTokens>;
  /** Only `defaultProps` apply; style the avatars through `Avatar`. */
  AvatarGroup?: Pick<ComponentTheme<AvatarGroupProps, never>, 'defaultProps'>;
  /** Tokens are Button tokens. */
  IconButton?: ComponentTheme<IconButtonProps, ButtonTokens>;
  /** Only `defaultProps` apply; it uses the Button tokens. */
  LinkButton?: Pick<ComponentTheme<LinkButtonProps, never>, 'defaultProps'>;
  Range?: ComponentTheme<RangeProps, RangeTokens>;
  /** Tokens are TextField tokens, for the trigger. */
  Select?: ComponentTheme<SelectProps, TextFieldTokens>;
  /** Only `defaultProps` apply; it uses the Button tokens. */
  SplitButton?: Pick<ComponentTheme<SplitButtonProps, never>, 'defaultProps'>;
  /** Tokens are TextField tokens. */
  TextArea?: ComponentTheme<TextAreaProps, TextFieldTokens>;
  Badge?: ComponentTheme<BadgeProps, BadgeTokens>;
  Banner?: ComponentTheme<BannerProps, BannerTokens>;
  EmptyState?: ComponentTheme<EmptyStateProps, Record<string, never>>;
  Lozenge?: ComponentTheme<LozengeProps, LozengeTokens>;
  Pressable?: ComponentTheme<PressableProps, PressableTokens>;
  ProgressBar?: ComponentTheme<ProgressBarProps, ProgressBarTokens>;
  ProgressIndicator?: ComponentTheme<ProgressIndicatorProps, ProgressIndicatorTokens>;
  SectionMessage?: ComponentTheme<SectionMessageProps, SectionMessageTokens>;
  Skeleton?: ComponentTheme<SkeletonProps, SkeletonTokens>;
  Tag?: ComponentTheme<TagProps, TagTokens>;
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
