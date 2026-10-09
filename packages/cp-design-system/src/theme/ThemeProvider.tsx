import { createContext, useContext, type ReactNode } from 'react';
import { darkTheme, lightTheme, type Theme } from './themes';

// Platform-agnostic: only React context, no DOM or React Native imports.
const ThemeContext = createContext<Theme>(lightTheme);

export interface ThemeProviderProps {
  /** `'light'`, `'dark'`, or a custom theme from `createTheme`. Defaults to light. */
  theme?: 'light' | 'dark' | Theme;
  children?: ReactNode;
}

export function ThemeProvider({ theme = 'light', children }: ThemeProviderProps) {
  const value = theme === 'light' ? lightTheme : theme === 'dark' ? darkTheme : theme;
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Returns the active theme. Works without a provider (falls back to the light theme). */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
