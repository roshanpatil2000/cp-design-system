import type { Theme } from '../../theme/types';

import type { IconGlyph } from '../Icon/Icon.types';

export interface MenuOption {
  value: string;
  label: string;
  isDisabled?: boolean;
  /** Secondary line under the label. */
  description?: string;
  /** Glyph before the label. */
  icon?: IconGlyph;
  /** Makes the item a checkbox item (menuitemcheckbox) showing a check when true. */
  isChecked?: boolean;
  /** Starts a new titled section; items keep the group of the last item that set one. */
  group?: string;
}

/** Visual values for dropdown menus (Select's list, SplitButton's actions). */
export interface MenuTokens {
  background: string;
  radius: number;
  paddingY: number;
  itemPaddingX: number;
  itemPaddingY: number;
  maxHeight: number;
  /** Gap between the trigger and the menu. */
  offset: number;
  text: string;
  textDisabled: string;
  textSelected: string;
  itemHovered: string;
  itemPressed: string;
  itemSelected: string;
  /** Bar on the left of the selected item, as in Atlassian menus. */
  selectedBar: string;
  fontSize: number;
  lineHeight: number;
  fontFamily?: string;
  shadow: string;
  description: string;
  groupTitle: string;
  divider: string;
  icon: string;
}

export function getMenuTokens(theme: Theme): MenuTokens {
  const c = theme.color;
  return {
    background: c['elevation.surface.overlay'],
    radius: theme.radius.medium,
    paddingY: 4,
    itemPaddingX: 12,
    itemPaddingY: 8,
    maxHeight: 300,
    offset: 4,
    text: c['color.text'],
    textDisabled: c['color.text.disabled'],
    textSelected: c['color.text.selected'],
    itemHovered: c['color.background.neutral.subtle.hovered'],
    itemPressed: c['color.background.neutral.subtle.pressed'],
    itemSelected: c['color.background.selected'],
    selectedBar: c['color.border.selected'],
    fontSize: theme.text.body.fontSize,
    lineHeight: theme.text.body.lineHeight,
    fontFamily: theme.fontFamily.body,
    description: c['color.text.subtlest'],
    groupTitle: c['color.text.subtle'],
    divider: c['color.border'],
    icon: c['color.icon.subtle'],
    shadow:
      theme.mode === 'dark'
        ? '0 0 0 1px #BCD6F01F, 0 8px 12px #0304048F, 0 0 1px #03040480'
        : '0 8px 12px #1E1F2126, 0 0 1px #1E1F214F',
  };
}

/** Next enabled index from `from` in `step` direction, wrapping around. */
export function nextEnabled(options: MenuOption[], from: number, step: 1 | -1): number {
  const n = options.length;
  for (let i = 1; i <= n; i++) {
    const idx = (((from + step * i) % n) + n) % n;
    if (!options[idx]?.isDisabled) return idx;
  }
  return from;
}

export const firstEnabled = (options: MenuOption[]) => options.findIndex((o) => !o.isDisabled);

/** Section header for item `i`, when it starts a new group. */
export function groupHeaderAt(options: MenuOption[], i: number): string | null {
  const g = options[i]?.group;
  if (!g) return null;
  return i === 0 || options[i - 1]?.group !== g ? g : null;
}
