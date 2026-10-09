import {
  atlassianDarkColors,
  atlassianLightColors,
  atlassianOpacity,
} from '../tokens/atlassian/colors.generated';
import { atlassianBrandTokens } from '../tokens/atlassian/brand.generated';
import { atlassianSpace } from '../tokens/atlassian/spacing.generated';
import { atlassianBorderWidth, atlassianRadius } from '../tokens/atlassian/shape.generated';
import {
  atlassianFontFamilies,
  atlassianTextStyles,
} from '../tokens/atlassian/typography.generated';
import {
  atlassianDurations,
  atlassianEasings,
  atlassianInteractions,
} from '../tokens/atlassian/motion.generated';
import type { BrandStep } from '../tokens/atlassian/brand.generated';
import { createBrandRamp, readableTextOn, type BrandRamp } from './brand';
import { contrastRatio } from './color';
import type {
  ColorMode,
  ComponentThemes,
  FontFamilies,
  RadiusToken,
  SpringConfig,
  SpringName,
  TextStyle,
  TextStyleName,
  Theme,
  ThemeColors,
  ThemeMotion,
  ThemePair,
} from './types';

export const defaultSprings: Record<SpringName, SpringConfig> = {
  /** Quick and settled: toggles, checkboxes, small state changes. */
  snappy: { stiffness: 520, damping: 34, mass: 1 },
  /** Soft and calm: panels, popovers, layout shifts. */
  gentle: { stiffness: 220, damping: 26, mass: 1 },
  /** Playful overshoot: celebratory or attention-drawing moments. */
  bouncy: { stiffness: 420, damping: 15, mass: 1 },
};

type PerMode<T> = T | { light?: T; dark?: T };

export interface ThemeOptions {
  /** Shown in dev tools and Storybook. Defaults to "atlassian" or "brand". */
  name?: string;
  /**
   * Your brand color. It becomes the light-mode bold brand color exactly (primary buttons,
   * checked toggles), and a matching ramp is generated for hover, pressed, subtle and dark-mode
   * shades. Pass `{ light, dark }` to pin both modes yourself.
   */
  brand?: PerMode<string>;
  /** Override any semantic color token, e.g. `{ 'color.border.focused': '#FF5630' }`. */
  colors?: PerMode<Partial<ThemeColors>>;
  radius?: Partial<Record<RadiusToken, number>>;
  fontFamily?: FontFamilies;
  text?: Partial<Record<TextStyleName, Partial<TextStyle>>>;
  motion?: {
    durations?: Partial<ThemeMotion['durations']>;
    springs?: Partial<Record<SpringName, SpringConfig>>;
  };
  components?: ComponentThemes;
}

const forMode = <T>(value: PerMode<T> | undefined, mode: ColorMode): T | undefined => {
  if (value && typeof value === 'object' && ('light' in value || 'dark' in value)) {
    return (value as { light?: T; dark?: T })[mode];
  }
  return value as T | undefined;
};

/** WCAG minimum for brand foregrounds drawn on the page surface: text 4.5:1, icons and borders 3:1. */
function foregroundContrast(token: string): number | undefined {
  if (/^color\.(text|link)(\.|$)/.test(token)) return 4.5;
  if (/^color\.(icon|border)\./.test(token)) return 3;
  return undefined;
}

/**
 * Atlassian's blue always passes contrast, but a light brand (yellow, lime) would not. Walk the ramp
 * from the token's usual step toward the surface's opposite (darker in light mode, lighter in dark
 * mode) and use the first step that is readable.
 */
function readableStep(
  ramp: BrandRamp,
  start: BrandStep,
  mode: ColorMode,
  surface: string,
  minContrast: number,
): string {
  const steps = (Object.keys(ramp) as BrandStep[]).sort((a, b) => Number(a) - Number(b));
  const fromStart = steps.slice(steps.indexOf(start));
  const candidates =
    mode === 'light' ? fromStart : steps.slice(0, steps.indexOf(start) + 1).reverse();
  let best = ramp[start];
  for (const step of candidates) {
    const color = ramp[step];
    if (contrastRatio(color, surface) >= minContrast) return color;
    if (contrastRatio(color, surface) > contrastRatio(best, surface)) best = color;
  }
  return best;
}

function buildColors(mode: ColorMode, options: ThemeOptions): ThemeColors {
  const base = mode === 'light' ? atlassianLightColors : atlassianDarkColors;
  const colors = { ...base } as Record<string, string>;

  // A plain string is the light-mode brand; dark mode derives from it unless pinned with { dark }.
  const brand = typeof options.brand === 'string' ? { light: options.brand } : options.brand;
  const lightBrand = brand?.light;
  const darkBrand = brand?.dark;
  if (lightBrand || darkBrand) {
    // Dark mode uses step 400 as its bold color; derive it from the light brand unless pinned.
    const ramp =
      mode === 'dark' && darkBrand
        ? createBrandRamp(darkBrand, '400')
        : createBrandRamp((lightBrand ?? darkBrand)!, lightBrand ? '700' : '400');
    const surface = colors['elevation.surface']!;
    for (const [token, step] of Object.entries(atlassianBrandTokens[mode])) {
      const minContrast = foregroundContrast(token);
      colors[token] = minContrast
        ? readableStep(ramp, step, mode, surface, minContrast)
        : ramp[step];
    }
  }

  const bold = colors['color.background.brand.bold']!;
  colors['color.text.onBrand'] = readableTextOn(bold);
  colors['color.icon.onBrand'] = colors['color.text.onBrand'];

  return { ...colors, ...forMode(options.colors, mode) } as ThemeColors;
}

function buildTheme(mode: ColorMode, options: ThemeOptions): Theme {
  const text = Object.fromEntries(
    Object.entries(atlassianTextStyles).map(([name, style]) => [
      name,
      { ...style, ...options.text?.[name as TextStyleName] },
    ]),
  ) as Record<TextStyleName, TextStyle>;

  return {
    name: options.name ?? (options.brand ? 'brand' : 'atlassian'),
    mode,
    color: buildColors(mode, options),
    space: atlassianSpace,
    radius: { ...atlassianRadius, ...options.radius },
    borderWidth: atlassianBorderWidth,
    opacity: atlassianOpacity,
    text,
    fontFamily: options.fontFamily ?? {},
    motion: {
      durations: { ...atlassianDurations, ...options.motion?.durations },
      easings: atlassianEasings,
      interactions: atlassianInteractions,
      springs: { ...defaultSprings, ...options.motion?.springs },
    },
    components: options.components ?? {},
  };
}

/**
 * Creates a light and dark theme from Atlassian's tokens plus your customizations.
 *
 * ```ts
 * const theme = createTheme({ brand: '#7C3AED', radius: { medium: 10 } });
 * <ThemeProvider theme={theme} colorMode="system">…</ThemeProvider>
 * ```
 */
export function createTheme(options: ThemeOptions = {}): ThemePair {
  return { light: buildTheme('light', options), dark: buildTheme('dark', options) };
}

/** Atlassian's default theme (light and dark). */
export const atlassianTheme: ThemePair = createTheme();

/** CSS font-family stacks from Atlassian, for web apps that load Atlassian Sans or want its fallbacks. */
export const atlassianWebFontFamilies: FontFamilies = {
  body: atlassianFontFamilies.body,
  heading: atlassianFontFamilies.heading,
  code: atlassianFontFamilies.code,
};

/**
 * React Native only accepts weights in steps of 100 ('100'…'900'), so Atlassian's 653 becomes '700'.
 */
export function fontWeightFor(weight: number) {
  const rounded = Math.min(900, Math.max(100, Math.round(weight / 100) * 100));
  return String(rounded) as '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}
