import type { RadiusToken, Theme } from '../../theme/types';

export interface SkeletonProps {
  /** Number of pixels, or a CSS/RN percentage like `'100%'`. Defaults to `'100%'`. */
  width?: number | `${number}%`;
  /** Defaults to 16. */
  height?: number;
  /** A radius token or pixels. Defaults to `'small'`. Use `'full'` for avatars. */
  borderRadius?: RadiusToken | number;
  /** Pulses between two shades while content loads. Defaults to `true`; off with reduced motion. */
  isShimmering?: boolean;
  tokens?: Partial<SkeletonTokens>;
  testID?: string;
}

export interface SkeletonTokens {
  color: string;
  /** The other end of the pulse. */
  colorSubtle: string;
  /** Milliseconds for one pulse (there and back). */
  pulseDuration: number;
}

export function getSkeletonTokens(theme: Theme): SkeletonTokens {
  return {
    color: theme.color['color.skeleton'],
    colorSubtle: theme.color['color.skeleton.subtle'],
    pulseDuration: 1600,
  };
}

export const skeletonRadius = (theme: Theme, r: SkeletonProps['borderRadius']) =>
  typeof r === 'number' ? r : theme.radius[r ?? 'small'];
