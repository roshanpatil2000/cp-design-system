import type { ToggleTokens } from './Toggle.tokens';

/**
 * Thumb width and position for a given progress (0 off … 1 on, may overshoot with springs) and
 * press amount (0 … 1). The thumb never leaves the track: overshoot beyond either end is turned
 * into a squash against that edge, and the press stretch grows toward the opposite side.
 * Pure arithmetic so it can run inside Reanimated worklets as well as on the web.
 */
export function thumbGeometry(
  t: Pick<ToggleTokens, 'width' | 'thumbSize' | 'thumbInset' | 'thumbStretch'>,
  progress: number,
  press: number,
) {
  'worklet';
  const p = Math.min(1, Math.max(0, progress));
  const overshoot = Math.min(0.4, Math.abs(progress - p));
  const width = t.thumbSize + t.thumbStretch * press - overshoot * t.thumbSize;
  const x = t.thumbInset + p * (t.width - 2 * t.thumbInset - width);
  return { x, width };
}

/**
 * Platform-neutral geometry for the check and cross icons, drawn with plain boxes so web and
 * native match exactly (no SVG dependency). Positions are relative to the track's top-left.
 */
export function toggleIconLayout(t: ToggleTokens) {
  const s = t.iconSize;
  const stroke = Math.max(1.5, Math.round(s / 6));
  const cy = t.height / 2;
  // The check sits where the thumb rests when off; the cross where it rests when on.
  const checkCx = t.thumbInset + t.thumbSize / 2;
  const crossCx = t.width - t.thumbInset - t.thumbSize / 2;
  const checkW = s * 0.36;
  const checkH = s * 0.68;
  return {
    stroke,
    /** An L shape (right and bottom borders) rotated 45°. */
    check: {
      left: checkCx - checkW / 2,
      top: cy - checkH / 2 - s * 0.08,
      width: checkW,
      height: checkH,
    },
    /** Two bars crossed at ±45°. */
    cross: { left: crossCx - stroke / 2, top: cy - (s * 0.8) / 2, width: stroke, height: s * 0.8 },
  };
}
