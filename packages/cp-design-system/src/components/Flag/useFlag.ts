import { resolveSpring, resolveTokens, withoutUndefined } from '../../theme/component';
import { useReducedMotion, useTheme } from '../../theme/context';
import type { FlagEntry } from './flagContext';
import { defaultFlagIcon, getFlagTokens } from './Flag.tokens';
import type { FlagProviderProps } from './Flag.types';

/** Provider props merged with `theme.components.Flag.defaultProps`. */
export function useFlagProviderProps(input: FlagProviderProps) {
  const theme = useTheme();
  return {
    ...theme.components.Flag?.defaultProps,
    ...withoutUndefined(input),
  } as FlagProviderProps;
}

/** Tokens, spring, icon and timing for one flag. */
export function useFlag(flag: FlagEntry, provider: FlagProviderProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const config = theme.components.Flag;
  const appearance = flag.appearance ?? 'normal';
  const tokens = resolveTokens(
    getFlagTokens(theme, appearance),
    theme,
    config?.tokens,
    provider.tokens,
  );
  const spring = resolveSpring(theme, reduceMotion, 'gentle', provider.motion, config?.motion);
  const icon = flag.icon === false ? null : (flag.icon ?? defaultFlagIcon[appearance]);
  return {
    tokens,
    spring,
    appearance,
    icon,
    enter: theme.motion.interactions['flag.enter'],
    exit: theme.motion.interactions['flag.exit'],
    reposition: theme.motion.interactions['flag.reposition'],
    autoDismiss: flag.isAutoDismiss ?? true,
    duration: provider.autoDismissDuration ?? 8000,
    /** Alerts interrupt screen readers; normal updates wait their turn. */
    role: appearance === 'error' || appearance === 'warning' ? 'alert' : 'status',
  } as const;
}
