export interface PaginationProps {
  /** Number of pages. */
  pages: number;
  /** Controlled zero-based page index. */
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onChange?: (index: number) => void;
  /** Most page buttons (including "…") shown at once. Defaults to 7. */
  max?: number;
  /** Accessible name. Defaults to `'Pagination'`. */
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Accessible name of a page button, from its 1-based number. Defaults to `Page 3`. */
  pageLabel?: (page: number) => string;
  testID?: string;
}

/**
 * Page indexes to show (zero-based), with `'…'` for gaps: always the first and last page, and
 * a window around the current one.
 */
export function pageItems(count: number, current: number, max = 7): (number | '…')[] {
  if (count <= max) return Array.from({ length: count }, (_, i) => i);
  const last = count - 1;
  const inner = max - 4; // first, last and two ellipses
  if (current < max - 3) return [...Array.from({ length: max - 2 }, (_, i) => i), '…', last];
  if (current > count - (max - 2))
    return [0, '…', ...Array.from({ length: max - 2 }, (_, i) => count - (max - 2) + i)];
  const start = current - Math.floor(inner / 2);
  return [0, '…', ...Array.from({ length: inner }, (_, i) => start + i), '…', last];
}
