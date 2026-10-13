import { describe, expect, it } from 'vitest';
import { placeFloating } from './placement';

const viewport = { width: 400, height: 800 };
const size = { width: 200, height: 100 };

describe('placeFloating', () => {
  it('places below the anchor, aligned to its start', () => {
    const p = placeFloating(
      { x: 50, y: 100, width: 80, height: 30 },
      size,
      viewport,
      'bottom-start',
      4,
    );
    expect(p).toEqual({ top: 134, left: 50, side: 'bottom' });
  });

  it('flips above when there is no room below', () => {
    const p = placeFloating(
      { x: 50, y: 750, width: 80, height: 30 },
      size,
      viewport,
      'bottom-start',
      4,
    );
    expect(p.side).toBe('top');
    expect(p.top).toBe(646);
  });

  it('keeps the panel inside the viewport horizontally', () => {
    const p = placeFloating(
      { x: 380, y: 100, width: 20, height: 20 },
      size,
      viewport,
      'bottom-start',
      4,
    );
    expect(p.left).toBe(192);
    const q = placeFloating(
      { x: 0, y: 100, width: 20, height: 20 },
      size,
      viewport,
      'bottom-end',
      4,
    );
    expect(q.left).toBe(8);
  });

  it('centers for top and bottom placements', () => {
    const p = placeFloating({ x: 150, y: 400, width: 100, height: 20 }, size, viewport, 'top', 8);
    expect(p).toEqual({ top: 292, left: 100, side: 'top' });
  });
});
