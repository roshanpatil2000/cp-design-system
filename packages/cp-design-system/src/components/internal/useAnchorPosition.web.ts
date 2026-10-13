import { useLayoutEffect, useState, type RefObject } from 'react';
import { placeFloating, type Placed, type Placement } from './placement';

/**
 * Keeps a fixed-position floating element next to its anchor while open: measures both, places
 * it with `placeFloating`, and follows scrolling and resizing.
 */
export function useAnchorPosition(
  isOpen: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  placement: Placement,
  offset: number,
) {
  const [pos, setPos] = useState<(Placed & { anchorWidth: number }) | null>(null);
  useLayoutEffect(() => {
    if (!isOpen) {
      setPos(null);
      return;
    }
    const place = () => {
      const a = anchorRef.current?.getBoundingClientRect();
      const f = floatingRef.current;
      if (!a) return;
      const placed = placeFloating(
        { x: a.left, y: a.top, width: a.width, height: a.height },
        { width: f?.offsetWidth ?? 0, height: f?.offsetHeight ?? 0 },
        { width: window.innerWidth, height: window.innerHeight },
        placement,
        offset,
      );
      setPos({ ...placed, anchorWidth: a.width });
    };
    place();
    const raf = requestAnimationFrame(place);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [isOpen, anchorRef, floatingRef, placement, offset]);
  return pos;
}
