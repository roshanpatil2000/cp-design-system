export type Placement = 'bottom-start' | 'bottom-end' | 'bottom' | 'top-start' | 'top-end' | 'top';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Placed {
  top: number;
  left: number;
  /** The side actually used, after flipping. */
  side: 'top' | 'bottom';
}

/** Space kept between a floating panel and the edge of the screen. */
export const VIEWPORT_MARGIN = 8;

/**
 * Positions a floating panel of `size` next to `anchor` inside a viewport: on the preferred side,
 * flipped to the other side when it doesn't fit, and slid horizontally to stay on screen.
 */
export function placeFloating(
  anchor: Rect,
  size: { width: number; height: number },
  viewport: { width: number; height: number },
  placement: Placement,
  offset: number,
): Placed {
  const [side, align = 'center'] = placement.split('-') as [
    'top' | 'bottom',
    'start' | 'end' | undefined,
  ];
  const below = anchor.y + anchor.height + offset;
  const above = anchor.y - offset - size.height;
  const fitsBelow = below + size.height <= viewport.height - VIEWPORT_MARGIN;
  const fitsAbove = above >= VIEWPORT_MARGIN;
  const useSide =
    side === 'bottom'
      ? fitsBelow || !fitsAbove
        ? 'bottom'
        : 'top'
      : fitsAbove || !fitsBelow
        ? 'top'
        : 'bottom';

  const preferredLeft =
    align === 'start'
      ? anchor.x
      : align === 'end'
        ? anchor.x + anchor.width - size.width
        : anchor.x + anchor.width / 2 - size.width / 2;
  const maxLeft = viewport.width - size.width - VIEWPORT_MARGIN;
  const left = Math.max(VIEWPORT_MARGIN, Math.min(preferredLeft, maxLeft));
  return { top: useSide === 'bottom' ? below : above, left, side: useSide };
}
