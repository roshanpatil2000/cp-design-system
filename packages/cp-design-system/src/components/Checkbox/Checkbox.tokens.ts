import type { Theme } from '../../theme/types';

/**
 * Every visual value the Checkbox and Radio use. Override any of them per theme or per instance.
 * Defaults follow Atlassian's checkbox and radio: a 14px control centered in a 24px hit area.
 */
export interface CheckboxTokens {
  /** Control size in px. */
  size: number;
  /** Corner radius. Radio ignores this and is always round. */
  radius: number;
  borderWidth: number;
  /** Row height; the control is centered in a square of this size. */
  hitSize: number;
  /** Space between the control's hit area and the label. */
  gap: number;
  /** How far the control shrinks while pressed (1 = no squish). */
  pressedScale: number;
  background: string;
  backgroundHovered: string;
  backgroundPressed: string;
  border: string;
  borderInvalid: string;
  checked: string;
  checkedHovered: string;
  checkedPressed: string;
  /** Tick, dash and radio dot. */
  mark: string;
  disabledBackground: string;
  disabledMark: string;
  label: string;
  labelDisabled: string;
  required: string;
  fontSize: number;
  lineHeight: number;
  fontFamily?: string;
  focusRing: string;
  focusRingWidth: number;
}

export function getCheckboxTokens(theme: Theme): CheckboxTokens {
  const c = theme.color;
  return {
    size: 14,
    radius: theme.radius.small,
    borderWidth: theme.borderWidth.default,
    hitSize: 24,
    gap: 4,
    pressedScale: 0.86,
    background: c['color.background.input'],
    backgroundHovered: c['color.background.input.hovered'],
    backgroundPressed: c['color.background.input.pressed'],
    border: c['color.border.input'],
    borderInvalid: c['color.border.danger'],
    checked: c['color.background.selected.bold'],
    checkedHovered: c['color.background.selected.bold.hovered'],
    checkedPressed: c['color.background.selected.bold.pressed'],
    mark: c['color.icon.inverse'],
    disabledBackground: c['color.background.disabled'],
    disabledMark: c['color.icon.disabled'],
    label: c['color.text'],
    labelDisabled: c['color.text.disabled'],
    required: c['color.text.danger'],
    fontSize: theme.text.body.fontSize,
    lineHeight: theme.text.body.lineHeight,
    fontFamily: theme.fontFamily.body,
    focusRing: c['color.border.focused'],
    focusRingWidth: theme.borderWidth.focused,
  };
}

/**
 * Geometry for the tick (an L rotated 45°) and the indeterminate dash, scaled to `size`.
 * Positions are relative to the control's padding box, i.e. inside a border of `borderWidth`.
 */
export function checkMarkLayout(size: number, borderWidth: number) {
  const stroke = Math.max(1.5, Math.round((size / 7) * 2) / 2);
  const w = size * 0.32;
  const h = size * 0.6;
  const dash = size * 0.58;
  return {
    stroke,
    tick: {
      width: w,
      height: h,
      left: size / 2 - w / 2 - borderWidth,
      top: size * 0.45 - h / 2 - borderWidth,
    },
    dash: {
      width: dash,
      height: stroke,
      left: (size - dash) / 2 - borderWidth,
      top: (size - stroke) / 2 - borderWidth,
    },
  };
}

/** Background, border and mark colors for a check/radio control in a given state. */
export function controlColors(
  t: CheckboxTokens,
  s: { on: boolean; disabled: boolean; invalid: boolean; hovered: boolean; pressed: boolean },
) {
  if (s.disabled) {
    return { fill: t.disabledBackground, border: t.disabledBackground, mark: t.disabledMark };
  }
  const fill = s.on
    ? s.pressed
      ? t.checkedPressed
      : s.hovered
        ? t.checkedHovered
        : t.checked
    : s.pressed
      ? t.backgroundPressed
      : s.hovered
        ? t.backgroundHovered
        : t.background;
  const border = s.invalid ? t.borderInvalid : s.on ? fill : t.border;
  return { fill, border, mark: t.mark };
}
