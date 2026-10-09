import type { Theme, ThemeColor } from '../../theme/types';
import type { ButtonAppearance, ButtonSpacing } from './Button.types';

/** Every visual value the Button uses. Override any of them per theme or per instance. */
export interface ButtonTokens {
  height: number;
  paddingX: number;
  /** Space between icons and the label. */
  gap: number;
  radius: number;
  fontSize: number;
  lineHeight: number;
  /** Numeric weight; native rounds it with `fontWeightFor`. */
  fontWeight: number;
  fontFamily?: string;
  background: string;
  backgroundHovered: string;
  backgroundPressed: string;
  text: string;
  /** Border color, or `'transparent'` for none. */
  border: string;
  borderWidth: number;
  backgroundDisabled: string;
  textDisabled: string;
  borderDisabled: string;
  iconSize: number;
  spinnerSize: number;
  /** Scale while pressed. 1 turns the press animation off. */
  pressScale: number;
  focusRing: string;
  focusRingWidth: number;
  focusRingGap: number;
}

type Palette = Pick<
  ButtonTokens,
  'background' | 'backgroundHovered' | 'backgroundPressed' | 'text' | 'border'
>;

// Colors from Atlassian's Button (new-button) styles.
const bold =
  (name: string, text: ThemeColor) =>
  (c: Theme['color']): Palette => ({
    background: c[`color.background.${name}.bold` as ThemeColor],
    backgroundHovered: c[`color.background.${name}.bold.hovered` as ThemeColor],
    backgroundPressed: c[`color.background.${name}.bold.pressed` as ThemeColor],
    text: c[text],
    border: 'transparent',
  });

const neutral =
  (bordered: boolean) =>
  (c: Theme['color']): Palette => ({
    background: c['color.background.neutral.subtle'],
    backgroundHovered: c['color.background.neutral.subtle.hovered'],
    backgroundPressed: c['color.background.neutral.subtle.pressed'],
    text: c['color.text.subtle'],
    border: bordered ? c['color.border'] : 'transparent',
  });

const palettes: Record<ButtonAppearance, (c: Theme['color']) => Palette> = {
  default: neutral(true),
  subtle: neutral(false),
  primary: bold('brand', 'color.text.onBrand'),
  warning: bold('warning', 'color.text.warning.inverse'),
  danger: bold('danger', 'color.text.inverse'),
  discovery: bold('discovery', 'color.text.inverse'),
};

const selected = (c: Theme['color']): Palette => ({
  background: c['color.background.selected'],
  backgroundHovered: c['color.background.selected.hovered'],
  backgroundPressed: c['color.background.selected.pressed'],
  text: c['color.text.selected'],
  border: c['color.border.selected'],
});

export function getButtonTokens(
  theme: Theme,
  appearance: ButtonAppearance,
  spacing: ButtonSpacing,
  isSelected: boolean,
): ButtonTokens {
  const c = theme.color;
  const compact = spacing === 'compact';
  const palette = isSelected ? selected(c) : palettes[appearance](c);
  const bordered = appearance === 'default' || appearance === 'subtle';
  return {
    height: compact ? 24 : 32,
    paddingX: theme.space['150'],
    gap: theme.space['075'],
    radius: compact ? theme.radius.small : theme.radius.medium,
    fontSize: theme.text.body.fontSize,
    lineHeight: theme.text.body.lineHeight,
    fontWeight: 500,
    fontFamily: theme.fontFamily.body,
    ...palette,
    borderWidth: theme.borderWidth.default,
    // Default and subtle buttons stay transparent when disabled; filled ones turn grey.
    backgroundDisabled: bordered ? 'transparent' : c['color.background.disabled'],
    textDisabled: c['color.text.disabled'],
    borderDisabled: appearance === 'default' ? c['color.border.disabled'] : 'transparent',
    iconSize: compact ? 12 : 16,
    spinnerSize: compact ? 12 : 16,
    pressScale: 0.96,
    focusRing: c['color.border.focused'],
    focusRingWidth: theme.borderWidth.focused,
    focusRingGap: 2,
  };
}
