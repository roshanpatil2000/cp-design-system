import { useSyncExternalStore } from 'react';
import { ThemeProviderBase, type ThemeProviderProps } from './context';

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => (typeof window !== 'undefined' && window.matchMedia?.(query).matches) || false,
    () => false,
  );
}

export function ThemeProvider(props: ThemeProviderProps) {
  const dark = useMediaQuery('(prefers-color-scheme: dark)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return (
    <ThemeProviderBase
      {...props}
      systemColorMode={dark ? 'dark' : 'light'}
      systemReducedMotion={reduced}
    />
  );
}
