import { useEffect, useState } from 'react';
import { AccessibilityInfo, useColorScheme } from 'react-native';
import { ThemeProviderBase, type ThemeProviderProps } from './context';

function useOsReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => active && setReduced(value));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduced;
}

export function ThemeProvider(props: ThemeProviderProps) {
  const scheme = useColorScheme();
  const reduced = useOsReducedMotion();
  return (
    <ThemeProviderBase
      {...props}
      systemColorMode={scheme === 'dark' ? 'dark' : 'light'}
      systemReducedMotion={reduced}
    />
  );
}
