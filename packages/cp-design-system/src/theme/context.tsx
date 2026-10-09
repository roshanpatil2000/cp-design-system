import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { atlassianTheme } from './createTheme';
import type { ColorMode, Theme, ThemePair } from './types';

/** Haptic events components may emit. Map them to your platform's haptics API. */
export type HapticEvent =
  'selection' | 'impactLight' | 'impactMedium' | 'success' | 'warning' | 'error';
export type HapticsAdapter = (event: HapticEvent) => void;

export type ColorModePreference = ColorMode | 'system';
export type MotionPreference = 'system' | 'full' | 'reduced';

interface DesignSystemContextValue {
  theme: Theme;
  reduceMotion: boolean;
  haptics: HapticsAdapter;
}

const noHaptics: HapticsAdapter = () => {};

const DesignSystemContext = createContext<DesignSystemContextValue>({
  theme: atlassianTheme.light,
  reduceMotion: false,
  haptics: noHaptics,
});

export interface ThemeProviderProps {
  /** A theme from `createTheme()` (light and dark pair) or a single `Theme`. Defaults to Atlassian. */
  theme?: ThemePair | Theme;
  /** Defaults to `'light'`. `'system'` follows the OS or browser setting. */
  colorMode?: ColorModePreference;
  /**
   * Defaults to `'system'`, which respects the OS "reduce motion" setting.
   * `'reduced'` makes every animation instant; `'full'` ignores the OS setting.
   */
  motion?: MotionPreference;
  /**
   * Called when components want haptic feedback, e.g. a toggle flipping. No-op by default.
   * Expo example: `haptics={(e) => e === 'selection' ? Haptics.selectionAsync() : …}`
   */
  haptics?: HapticsAdapter;
  children?: ReactNode;
}

const isThemePair = (theme: ThemePair | Theme): theme is ThemePair => 'light' in theme;

/** Shared provider. The platform `ThemeProvider` passes in the OS color scheme and motion setting. */
export function ThemeProviderBase({
  theme = atlassianTheme,
  colorMode = 'light',
  motion = 'system',
  haptics = noHaptics,
  systemColorMode,
  systemReducedMotion,
  children,
}: ThemeProviderProps & { systemColorMode: ColorMode; systemReducedMotion: boolean }) {
  const mode = colorMode === 'system' ? systemColorMode : colorMode;
  const resolved = isThemePair(theme) ? theme[mode] : theme;
  const reduceMotion = motion === 'reduced' || (motion === 'system' && systemReducedMotion);

  const value = useMemo(
    () => ({ theme: resolved, reduceMotion, haptics }),
    [resolved, reduceMotion, haptics],
  );
  return <DesignSystemContext.Provider value={value}>{children}</DesignSystemContext.Provider>;
}

/** The active theme. Works without a provider (Atlassian light). */
export function useTheme(): Theme {
  return useContext(DesignSystemContext).theme;
}

/** True when animations should be instant (user setting or `motion="reduced"`). */
export function useReducedMotion(): boolean {
  return useContext(DesignSystemContext).reduceMotion;
}

/** The haptics adapter from the provider (a no-op if none was given). */
export function useHaptics(): HapticsAdapter {
  return useContext(DesignSystemContext).haptics;
}
