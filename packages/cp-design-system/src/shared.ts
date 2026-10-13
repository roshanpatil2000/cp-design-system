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
export type { BoxProps, StyleObject } from './components/Box/Box.types';
export type { StackProps, InlineProps } from './components/Stack/Stack.types';
export type { TextProps, TextSize, TextWeight } from './components/Text/Text.types';
export type { HeadingProps, HeadingSize } from './components/Heading/Heading.types';
export type { IconProps, IconGlyph, IconSize } from './components/Icon/Icon.types';
export type {
  PressableProps,
  PressableState,
  PressableTokens,
} from './components/Pressable/Pressable.types';
export { getPressableTokens } from './components/Pressable/Pressable.types';
export type { SpinnerProps, SpinnerSize } from './components/Spinner/Spinner.types';
export type {
  ProgressBarProps,
  ProgressBarAppearance,
  ProgressBarTokens,
} from './components/ProgressBar/ProgressBar.types';
export type {
  ProgressIndicatorProps,
  ProgressIndicatorAppearance,
  ProgressIndicatorTokens,
} from './components/ProgressIndicator/ProgressIndicator.types';
export type {
  LozengeProps,
  LozengeAppearance,
  LozengeTokens,
} from './components/Lozenge/Lozenge.types';
export type { BadgeProps, BadgeAppearance, BadgeTokens } from './components/Badge/Badge.types';
export type { TagProps, TagColor, TagTokens } from './components/Tag/Tag.types';
export type { BannerProps, BannerAppearance, BannerTokens } from './components/Banner/Banner.types';
export type {
  SectionMessageProps,
  SectionMessageAppearance,
  SectionMessageAction,
  SectionMessageTokens,
} from './components/SectionMessage/SectionMessage.types';
export type { SkeletonProps, SkeletonTokens } from './components/Skeleton/Skeleton.types';
export type { EmptyStateProps } from './components/EmptyState/EmptyState.types';
export type { IconButtonProps } from './components/IconButton/IconButton.types';
export type { LinkButtonProps } from './components/LinkButton/LinkButton.types';
export type { SplitButtonProps, SplitButtonItem } from './components/SplitButton/SplitButton.types';
export type { FieldProps, FieldControlProps } from './components/Field/Field.types';
export type { TextAreaProps } from './components/TextArea/TextArea.types';
export type { SelectProps, SelectOption } from './components/Select/Select.types';
export type { RangeProps, RangeTokens } from './components/Range/Range.types';
export { getRangeTokens } from './components/Range/Range.types';
export type {
  AvatarProps,
  AvatarSize,
  AvatarPresence,
  AvatarTokens,
} from './components/Avatar/Avatar.types';
export { getAvatarTokens, avatarSizes } from './components/Avatar/Avatar.types';
export type { AvatarGroupProps, AvatarGroupItem } from './components/AvatarGroup/AvatarGroup.types';
export type { PopupProps, PopupPlacement, PopupTokens } from './components/Popup/Popup.types';
export { getPopupTokens } from './components/Popup/Popup.types';
export type { InlineDialogProps } from './components/InlineDialog/InlineDialog.types';
export type { TooltipProps, TooltipTokens } from './components/Tooltip/Tooltip.types';
export type {
  DropdownMenuProps,
  DropdownMenuItem,
} from './components/DropdownMenu/DropdownMenu.types';
export type { DrawerProps, DrawerWidth, DrawerTokens } from './components/Drawer/Drawer.types';
export type { TabsProps, TabItem, TabsTokens } from './components/Tabs/Tabs.types';
export type { BreadcrumbsProps, BreadcrumbItem } from './components/Breadcrumbs/Breadcrumbs.types';
export type { PaginationProps } from './components/Pagination/Pagination.types';
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
