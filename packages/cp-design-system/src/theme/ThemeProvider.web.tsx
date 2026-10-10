import { ThemeProviderBase, type ThemeProviderProps } from './context';
import { useMediaQuery } from './useMediaQuery.web';

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
