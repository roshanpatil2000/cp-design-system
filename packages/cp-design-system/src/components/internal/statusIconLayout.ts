export type StatusKind = 'error' | 'warning' | 'success' | 'info';

/**
 * Geometry for status icons (a filled circle with a glyph), drawn with plain boxes so the web and
 * native versions match exactly without an SVG dependency. All values scale with `size`.
 */
export function statusIconLayout(kind: StatusKind, size: number) {
  const s = size;
  const stroke = s / 6;
  const cx = (s - stroke) / 2;
  if (kind === 'success') {
    return {
      check: { left: s / 3, top: s / 6, width: s * 0.29, height: s / 2, stroke: s * 0.146 },
      bars: [],
    };
  }
  // "!" for error and warning; "i" (dot on top) for info.
  const bar = { left: cx, width: stroke, borderRadius: stroke / 2 };
  return {
    check: null,
    bars:
      kind === 'info'
        ? [
            { ...bar, top: s * 0.21, height: stroke },
            { ...bar, top: s * 0.42, height: s * 0.375 },
          ]
        : [
            { ...bar, top: s * 0.21, height: s * 0.375 },
            { ...bar, top: s * 0.67, height: stroke },
          ],
  };
}
