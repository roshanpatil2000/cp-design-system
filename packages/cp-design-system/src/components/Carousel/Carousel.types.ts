import type { ReactNode } from 'react';
import type { MotionOverride, SpaceToken } from '../../theme/types';

export interface CarouselProps {
  /** One child per slide. */
  children: ReactNode;
  /** Accessible name, e.g. `'Featured projects'`. */
  label: string;
  /** Controlled slide index. */
  index?: number;
  /** Initial slide when uncontrolled. Defaults to 0. */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /**
   * Slide width: a fraction of the carousel (`'85%'`) to peek at the next slide, or pixels.
   * Defaults to `'100%'`.
   */
  slideWidth?: number | `${number}%`;
  /** Gap between slides. Defaults to `'200'` (16px). */
  space?: SpaceToken;
  /** Show step dots under the slides. Defaults to `true`. */
  showDots?: boolean;
  /** Show previous/next buttons. Defaults to `true` on web and `false` on native. */
  showArrows?: boolean;
  /** Wrap from the last slide to the first. Defaults to `false`. */
  loop?: boolean;
  /** Milliseconds between automatic advances. Pauses on hover, focus and touch; off with reduced motion. */
  autoPlay?: number;
  /** Accessible name of a slide. Defaults to `Slide 2 of 5`. */
  slideLabel?: (index: number, count: number) => string;
  tokens?: Partial<CarouselTokens>;
  /** Spring for snapping between slides, or `false`. Defaults to the theme's `gentle`. */
  motion?: MotionOverride;
  testID?: string;
}

export interface CarouselTokens {
  /** Scale of slides next to the current one (peek layouts). 1 turns it off. */
  inactiveScale: number;
  /** Opacity of slides next to the current one. */
  inactiveOpacity: number;
  /** Space between the slides and the dots. */
  dotsGap: number;
  /** Drag distance (fraction of a slide) or fling speed (px/s) that changes slide. */
  swipeThreshold: number;
  swipeVelocity: number;
}

export function getCarouselTokens(): CarouselTokens {
  return {
    inactiveScale: 0.94,
    inactiveOpacity: 0.6,
    dotsGap: 12,
    swipeThreshold: 0.2,
    swipeVelocity: 500,
  };
}

export const defaultSlideLabel = (i: number, count: number) => `Slide ${i + 1} of ${count}`;

/** Slide width in px from the carousel's width. */
export function slidePx(slideWidth: CarouselProps['slideWidth'], viewport: number) {
  if (typeof slideWidth === 'number') return Math.min(slideWidth, viewport);
  const pct = parseFloat(slideWidth ?? '100%');
  return (viewport * (Number.isFinite(pct) ? pct : 100)) / 100;
}

/** Track offset (px) that shows slide `index`, centered when slides are narrower than the viewport. */
export function trackOffset(index: number, slide: number, gap: number, viewport: number) {
  return (viewport - slide) / 2 - index * (slide + gap);
}

/** Which slide a drag lands on, from where it started and how far / how fast it moved. */
export function landingIndex(
  start: number,
  dragged: number,
  velocity: number,
  slide: number,
  t: Pick<CarouselTokens, 'swipeThreshold' | 'swipeVelocity'>,
) {
  if (Math.abs(velocity) > t.swipeVelocity) return start + (velocity < 0 ? 1 : -1);
  const moved = -dragged / Math.max(1, slide);
  if (Math.abs(moved) < t.swipeThreshold) return start;
  return start + Math.round(moved + Math.sign(moved) * (0.5 - t.swipeThreshold));
}
