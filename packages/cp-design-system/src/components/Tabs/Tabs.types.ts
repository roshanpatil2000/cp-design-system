import type { ReactNode } from 'react';
import type { MotionOverride, Theme } from '../../theme/types';

export interface TabItem {
  id: string;
  label: string;
  /** The panel shown while this tab is selected. */
  content?: ReactNode;
  isDisabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  /** Controlled selection (a tab id). */
  selected?: string;
  /** Initial selection when uncontrolled. Defaults to the first tab. */
  defaultSelected?: string;
  onChange?: (id: string) => void;
  /** Accessible name of the tab list. */
  label?: string;
  /** Tabs share the full width equally. */
  shouldFitContainer?: boolean;
  tokens?: Partial<TabsTokens>;
  /** Spring for the sliding underline, or `false`. */
  motion?: MotionOverride;
  testID?: string;
}

export interface TabsTokens {
  text: string;
  textHovered: string;
  textSelected: string;
  textDisabled: string;
  indicator: string;
  indicatorHeight: number;
  /** The line under all tabs. */
  divider: string;
  dividerHeight: number;
  height: number;
  paddingX: number;
  gap: number;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  fontFamily?: string;
  focusRing: string;
  hoverBackground: string;
}

export function getTabsTokens(theme: Theme): TabsTokens {
  const c = theme.color;
  return {
    text: c['color.text.subtle'],
    textHovered: c['color.text'],
    textSelected: c['color.text.selected'],
    textDisabled: c['color.text.disabled'],
    indicator: c['color.border.selected'],
    indicatorHeight: 2,
    divider: c['color.border'],
    dividerHeight: 2,
    height: 36,
    paddingX: 8,
    gap: 0,
    fontSize: theme.text.body.fontSize,
    lineHeight: theme.text.body.lineHeight,
    fontWeight: 500,
    fontFamily: theme.fontFamily.body,
    focusRing: c['color.border.focused'],
    hoverBackground: c['color.background.neutral.subtle.hovered'],
  };
}
