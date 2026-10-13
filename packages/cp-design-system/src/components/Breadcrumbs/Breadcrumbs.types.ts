import type { Theme } from '../../theme/types';

export interface BreadcrumbItem {
  label: string;
  /** Link target. On native it opens with `Linking` unless you pass `onPress`. */
  href?: string;
  onPress?: () => void;
}

export interface BreadcrumbsProps {
  /** From the root to the current page; the last item is the current page. */
  items: BreadcrumbItem[];
  /** More items than this collapse into "…". Defaults to 8. */
  maxItems?: number;
  /** Items kept before the "…". Defaults to 1. */
  itemsBeforeCollapse?: number;
  /** Items kept after the "…". Defaults to 1. */
  itemsAfterCollapse?: number;
  /** Accessible name of the navigation. Defaults to `'Breadcrumbs'`. */
  label?: string;
  testID?: string;
}

export interface BreadcrumbsTokens {
  link: string;
  current: string;
  separator: string;
  fontSize: number;
  lineHeight: number;
  fontFamily?: string;
}

export function getBreadcrumbsTokens(theme: Theme): BreadcrumbsTokens {
  return {
    link: theme.color['color.text.subtle'],
    current: theme.color['color.text.subtle'],
    separator: theme.color['color.text.subtlest'],
    fontSize: theme.text.body.fontSize,
    lineHeight: theme.text.body.lineHeight,
    fontFamily: theme.fontFamily.body,
  };
}

/** Visible items, with `null` marking the collapsed "…" position. */
export function visibleCrumbs(
  items: BreadcrumbItem[],
  expanded: boolean,
  maxItems = 8,
  before = 1,
  after = 1,
): (BreadcrumbItem | null)[] {
  if (expanded || items.length <= maxItems || before + after >= items.length) return items;
  return [...items.slice(0, before), null, ...items.slice(items.length - after)];
}
