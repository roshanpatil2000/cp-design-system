import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import {
  ThemeProvider,
  atlassianBlueRamp,
  atlassianLightColors,
  atlassianDarkColors,
  atlassianSpace,
  atlassianDurations,
  contrastRatio,
  createBrandRamp,
  createTheme,
  fontWeightFor,
  resolveSpring,
  resolveTokens,
  useHaptics,
  useReducedMotion,
  useTheme,
  type BrandStep,
} from '../index.web';
import { parseHex, rgbToOklch, toHex } from '../theme/color';

afterEach(cleanup);

const lightness = (hex: string) => rgbToOklch(parseHex(hex)).l;
const STEPS = Object.keys(atlassianBlueRamp) as BrandStep[];

describe('generated Atlassian tokens', () => {
  it('include the core values', () => {
    expect(atlassianLightColors['color.background.brand.bold']).toBe('#1868DB');
    expect(atlassianDarkColors['color.background.brand.bold']).toBe('#669DF1');
    expect(atlassianSpace['100']).toBe(8);
    expect(atlassianDurations.short).toBe(150);
  });

  it('define every light token in dark mode too', () => {
    const missing = Object.keys(atlassianLightColors).filter(
      (k) => !(atlassianDarkColors as Record<string, string>)[k],
    );
    expect(missing).toEqual([]);
  });
});

describe('color utilities', () => {
  it('parse 3, 6 and 8 digit hex and round-trip', () => {
    expect(toHex(parseHex('#fff'))).toBe('#FFFFFF');
    expect(toHex(parseHex('#1868db'))).toBe('#1868DB');
    expect(parseHex('#00000080').a).toBeCloseTo(0.5, 2);
    expect(() => parseHex('blue')).toThrow(/not a valid hex/);
  });

  it('compute WCAG contrast', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
  });
});

describe('createBrandRamp', () => {
  it('keeps the brand color exactly at the anchor step', () => {
    expect(createBrandRamp('#7c3aed')['700']).toBe('#7C3AED');
    expect(createBrandRamp('#7c3aed', '400')['400']).toBe('#7C3AED');
  });

  it("reproduces Atlassian's own Blue ramp from its brand color", () => {
    const ramp = createBrandRamp(atlassianBlueRamp['700']);
    for (const step of STEPS) {
      expect(Math.abs(lightness(ramp[step]) - lightness(atlassianBlueRamp[step]))).toBeLessThan(
        0.01,
      );
    }
  });

  it('gets darker step by step, like Atlassian (100 light to 900 dark)', () => {
    for (const brand of ['#7C3AED', '#E5484D', '#0E9F6E', '#F5B800']) {
      const ramp = createBrandRamp(brand);
      const ordered = STEPS.filter((s) => s !== '1000').map((s) => lightness(ramp[s]));
      for (let i = 1; i < ordered.length; i++) expect(ordered[i]).toBeLessThan(ordered[i - 1]!);
    }
  });
});

describe('createTheme', () => {
  it('defaults to the Atlassian tokens', () => {
    const { light, dark } = createTheme();
    expect(light.mode).toBe('light');
    expect(light.color['color.background.brand.bold']).toBe('#1868DB');
    expect(dark.color['color.background.brand.bold']).toBe('#669DF1');
    expect(light.color['color.text.onBrand']).toBe('#FFFFFF');
  });

  it('applies a brand color to every brand role in both modes', () => {
    const { light, dark } = createTheme({ brand: '#7C3AED' });
    const ramp = createBrandRamp('#7C3AED');
    expect(light.color['color.background.brand.bold']).toBe('#7C3AED');
    expect(light.color['color.border.focused']).toBe(ramp['500']);
    expect(light.color['color.link']).toBe('#7C3AED');
    expect(light.color['color.background.selected.bold']).toBe('#7C3AED');
    expect(dark.color['color.background.brand.bold']).toBe(ramp['400']);
  });

  it('leaves accent and information blues alone', () => {
    const { light } = createTheme({ brand: '#E5484D' });
    expect(light.color['color.background.information.bold']).toBe(
      atlassianLightColors['color.background.information.bold'],
    );
    expect(light.color['color.background.accent.blue.subtle']).toBe(
      atlassianLightColors['color.background.accent.blue.subtle'],
    );
  });

  it('lets each mode be pinned separately', () => {
    const { light, dark } = createTheme({ brand: { light: '#7C3AED', dark: '#C4B5FD' } });
    expect(light.color['color.background.brand.bold']).toBe('#7C3AED');
    expect(dark.color['color.background.brand.bold']).toBe('#C4B5FD');
  });

  it('picks readable text for light and dark brand colors', () => {
    const yellow = createTheme({ brand: '#FACC15' }).light;
    const purple = createTheme({ brand: '#5B21B6' }).light;
    expect(yellow.color['color.text.onBrand']).not.toBe('#FFFFFF');
    expect(purple.color['color.text.onBrand']).toBe('#FFFFFF');
    for (const t of [yellow, purple]) {
      expect(
        contrastRatio(t.color['color.background.brand.bold'], t.color['color.text.onBrand']),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps brand text, links, icons and focus rings readable for any brand color', () => {
    for (const brand of ['#F5B800', '#FACC15', '#A3E635', '#1E1B4B', '#7C3AED']) {
      for (const theme of Object.values(createTheme({ brand }))) {
        const surface = theme.color['elevation.surface'];
        for (const token of ['color.text.brand', 'color.link', 'color.text.selected'] as const) {
          expect(contrastRatio(theme.color[token], surface)).toBeGreaterThanOrEqual(4.5);
        }
        for (const token of [
          'color.icon.brand',
          'color.border.focused',
          'color.border.brand',
        ] as const) {
          expect(contrastRatio(theme.color[token], surface)).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });

  it('applies color, radius, text, font and motion overrides', () => {
    const { light, dark } = createTheme({
      colors: { light: { 'color.border.focused': '#FF5630' } },
      radius: { medium: 10 },
      text: { body: { fontSize: 15 } },
      fontFamily: { body: 'Inter' },
      motion: {
        springs: { snappy: { stiffness: 1, damping: 2, mass: 3 } },
        durations: { short: 90 },
      },
    });
    expect(light.color['color.border.focused']).toBe('#FF5630');
    expect(dark.color['color.border.focused']).toBe(atlassianDarkColors['color.border.focused']);
    expect(light.radius.medium).toBe(10);
    expect(light.radius.small).toBe(4);
    expect(light.text.body).toEqual({ fontSize: 15, lineHeight: 20, fontWeight: 400 });
    expect(light.fontFamily.body).toBe('Inter');
    expect(light.motion.springs.snappy).toEqual({ stiffness: 1, damping: 2, mass: 3 });
    expect(light.motion.springs.gentle.stiffness).toBeGreaterThan(0);
    expect(light.motion.durations.short).toBe(90);
  });

  it('rounds font weights for native', () => {
    expect(fontWeightFor(653)).toBe('700');
    expect(fontWeightFor(400)).toBe('400');
    expect(fontWeightFor(1200)).toBe('900');
  });
});

describe('component customization helpers', () => {
  const theme = createTheme().light;
  const defaults = { trackColor: 'grey', thumbSize: 12 };

  it('resolveTokens: instance > theme > defaults', () => {
    expect(resolveTokens(defaults, theme)).toEqual(defaults);
    expect(resolveTokens(defaults, theme, { thumbSize: 14 })).toEqual({
      trackColor: 'grey',
      thumbSize: 14,
    });
    expect(
      resolveTokens(defaults, theme, (t) => ({ trackColor: t.color['color.border'] }), {
        thumbSize: 16,
      }),
    ).toEqual({ trackColor: theme.color['color.border'], thumbSize: 16 });
  });

  it('resolveSpring: instance > theme > default, null when reduced or off', () => {
    const custom = { stiffness: 10, damping: 5, mass: 1 };
    expect(resolveSpring(theme, false, 'snappy')).toEqual(theme.motion.springs.snappy);
    expect(resolveSpring(theme, false, 'snappy', undefined, 'gentle')).toEqual(
      theme.motion.springs.gentle,
    );
    expect(resolveSpring(theme, false, 'snappy', custom, 'gentle')).toEqual(custom);
    expect(resolveSpring(theme, false, 'snappy', false)).toBeNull();
    expect(resolveSpring(theme, true, 'snappy', custom)).toBeNull();
  });
});

describe('ThemeProvider (web)', () => {
  function Probe() {
    const theme = useTheme();
    const reduced = useReducedMotion();
    const haptics = useHaptics();
    return (
      <button data-testid="probe" onClick={() => haptics('selection')}>
        {`${theme.name}:${theme.mode}:${reduced}`}
      </button>
    );
  }

  function mockMedia(matches: Record<string, boolean>) {
    const listeners: Record<string, () => void> = {};
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: !!matches[query],
      media: query,
      addEventListener: (_: string, fn: () => void) => (listeners[query] = fn),
      removeEventListener: () => {},
    }));
    return {
      set(query: string, value: boolean) {
        matches[query] = value;
        listeners[query]?.();
      },
    };
  }

  afterEach(() => vi.unstubAllGlobals());

  it('works without a provider (Atlassian light, full motion)', () => {
    render(<Probe />);
    expect(screen.getByTestId('probe').textContent).toBe('atlassian:light:false');
  });

  it('selects the mode and follows the system setting live', () => {
    const media = mockMedia({ '(prefers-color-scheme: dark)': true });
    render(
      <ThemeProvider theme={createTheme({ brand: '#7C3AED' })} colorMode="system">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('probe').textContent).toBe('brand:dark:false');
    act(() => media.set('(prefers-color-scheme: dark)', false));
    expect(screen.getByTestId('probe').textContent).toBe('brand:light:false');
  });

  it('respects reduced motion from the system, and the motion prop overrides it', () => {
    mockMedia({ '(prefers-reduced-motion: reduce)': true });
    const { rerender } = render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('probe').textContent).toBe('atlassian:light:true');
    rerender(
      <ThemeProvider motion="full">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('probe').textContent).toBe('atlassian:light:false');
  });

  it('passes the haptics adapter through', () => {
    const haptics = vi.fn();
    render(
      <ThemeProvider haptics={haptics}>
        <Probe />
      </ThemeProvider>,
    );
    act(() => screen.getByTestId('probe').click());
    expect(haptics).toHaveBeenCalledWith('selection');
  });
});
