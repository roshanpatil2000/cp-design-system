import type { Theme } from '../../theme/types';
import type { ToggleAppearance, ToggleSize } from './Toggle.types';

/** Every visual value the Toggle uses. Override any of them per theme or per instance. */
export interface ToggleTokens {
  /** Track size in px. */
  width: number;
  height: number;
  thumbSize: number;
  /** Gap between thumb and track edge. */
  thumbInset: number;
  /** Extra thumb width while pressed (the squish). 0 turns it off. */
  thumbStretch: number;
  iconSize: number;
  trackOff: string;
  trackOffHovered: string;
  trackOn: string;
  trackOnHovered: string;
  trackDisabled: string;
  thumb: string;
  /** Check mark, drawn on the "on" track. */
  iconOn: string;
  /** Cross, drawn on the "off" track. */
  iconOff: string;
  iconDisabled: string;
  focusRing: string;
  focusRingWidth: number;
  /** Space between the track and the focus ring. */
  focusRingGap: number;
}

// Geometry from Atlassian's Toggle: regular 32×16 with a 12px knob, large 40×20 with a 16px knob.
const geometry: Record<
  ToggleSize,
  Pick<ToggleTokens, 'width' | 'height' | 'thumbSize' | 'thumbStretch' | 'iconSize'>
> = {
  regular: { width: 32, height: 16, thumbSize: 12, thumbStretch: 4, iconSize: 10 },
  large: { width: 40, height: 20, thumbSize: 16, thumbStretch: 5, iconSize: 12 },
};

export function getToggleTokens(
  theme: Theme,
  size: ToggleSize,
  appearance: ToggleAppearance,
): ToggleTokens {
  const c = theme.color;
  const on =
    appearance === 'brand'
      ? {
          trackOn: c['color.background.brand.bold'],
          trackOnHovered: c['color.background.brand.bold.hovered'],
        }
      : {
          trackOn: c['color.background.success.bold'],
          trackOnHovered: c['color.background.success.bold.hovered'],
        };
  return {
    ...geometry[size],
    thumbInset: 2,
    trackOff: c['color.background.neutral.bold'],
    trackOffHovered: c['color.background.neutral.bold.hovered'],
    ...on,
    trackDisabled: c['color.background.disabled'],
    thumb: c['color.icon.inverse'],
    iconOn: appearance === 'brand' ? c['color.icon.onBrand'] : c['color.icon.inverse'],
    iconOff: c['color.icon.inverse'],
    iconDisabled: c['color.icon.disabled'],
    focusRing: c['color.border.focused'],
    focusRingWidth: theme.borderWidth.focused,
    focusRingGap: 2,
  };
}

/** Distance the thumb travels from off to on. */
export const thumbTravel = (t: ToggleTokens) => t.width - t.thumbSize - 2 * t.thumbInset;
