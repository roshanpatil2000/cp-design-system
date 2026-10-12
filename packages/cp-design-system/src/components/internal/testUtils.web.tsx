import type { ReactElement } from 'react';
import { act, render } from '@testing-library/react';
import { ThemeProvider, createTheme, type ThemePair } from '../../index.web';

export const theme = createTheme().light;

/** jsdom reports colors as rgb()/rgba(); convert a #RRGGBB(AA) token to match. */
export function rgb(hex: string) {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  const a = n.length === 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1;
  return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`;
}

/** Motion writes styles on the next animation frame; wait two to be safe. */
export const frames = () =>
  act(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
  );

export function renderThemed(
  ui: ReactElement,
  options: { theme?: ThemePair; motion?: 'full' | 'reduced' } = {},
) {
  return render(
    <ThemeProvider theme={options.theme} motion={options.motion ?? 'reduced'}>
      {ui}
    </ThemeProvider>,
  );
}
