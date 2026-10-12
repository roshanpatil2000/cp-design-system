import { resolveSpring, resolveTokens, withoutUndefined } from './component';
import { useReducedMotion, useTheme } from './context';
import type { ComponentThemes, MotionOverride, SpringName, Theme } from './types';

interface ThemeEntry<P, Tokens> {
  defaultProps?: Partial<P>;
  tokens?: Partial<Tokens> | ((t: Theme) => Partial<Tokens>);
  motion?: MotionOverride;
}

/**
 * The standard customization pipeline used by every component: merges
 * `theme.components[name].defaultProps` under the props passed, resolves style tokens (defaults <
 * theme < instance `tokens` prop) and picks the spring (instance `motion` > theme > fallback).
 */
export function useComponent<
  P extends { tokens?: Partial<Tokens>; motion?: MotionOverride },
  Tokens extends object,
>(
  name: keyof ComponentThemes,
  input: P,
  getTokens: (theme: Theme, props: P) => Tokens,
  fallbackSpring: SpringName = 'snappy',
) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const config = theme.components[name] as ThemeEntry<P, Tokens> | undefined;
  const props = { ...config?.defaultProps, ...withoutUndefined(input) } as P;
  const tokens = resolveTokens(getTokens(theme, props), theme, config?.tokens, props.tokens);
  const spring = resolveSpring(theme, reduceMotion, fallbackSpring, props.motion, config?.motion);
  return { theme, props, tokens, spring, reduceMotion };
}
