import type { ComponentTheme, MotionOverride, SpringConfig, SpringName, Theme } from './types';

/**
 * Merges a component's style tokens in priority order:
 * defaults from the theme < `theme.components.X.tokens` < the instance's `tokens` prop.
 */
export function resolveTokens<Tokens extends object>(
  defaults: Tokens,
  theme: Theme,
  themeOverride?: ComponentTheme<unknown, Tokens>['tokens'],
  instanceOverride?: Partial<Tokens>,
): Tokens {
  const fromTheme = typeof themeOverride === 'function' ? themeOverride(theme) : themeOverride;
  return { ...defaults, ...fromTheme, ...instanceOverride };
}

/**
 * Picks the spring for an animation: instance `motion` prop > component theme > component default.
 * Returns `null` when motion is reduced or turned off, meaning "jump to the end value".
 */
export function resolveSpring(
  theme: Theme,
  reduceMotion: boolean,
  fallback: SpringName,
  ...overrides: (MotionOverride | undefined)[]
): SpringConfig | null {
  if (reduceMotion) return null;
  const chosen = overrides.find((o) => o !== undefined) ?? fallback;
  if (chosen === false) return null;
  return typeof chosen === 'string' ? theme.motion.springs[chosen] : chosen;
}
