import { palette } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { fontSizes, fontWeights, lineHeights } from '../tokens/typography';
import { radii } from '../tokens/radii';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryText: string;
  primarySubtle: string;
  success: string;
  successSubtle: string;
  warning: string;
  warningSubtle: string;
  danger: string;
  dangerSubtle: string;
}

export type ThemeColor = keyof ThemeColors;

export interface Theme {
  name: string;
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  lineHeights: typeof lineHeights;
}

const shared = { spacing, radii, fontSizes, fontWeights, lineHeights };

export const lightTheme: Theme = {
  name: 'light',
  ...shared,
  colors: {
    background: palette.white,
    surface: palette.white,
    surfaceMuted: palette.gray100,
    text: palette.gray900,
    textMuted: palette.gray500,
    border: palette.gray200,
    primary: palette.blue600,
    primaryText: palette.white,
    primarySubtle: palette.blue50,
    success: palette.green600,
    successSubtle: palette.green50,
    warning: palette.amber600,
    warningSubtle: palette.amber50,
    danger: palette.red600,
    dangerSubtle: palette.red50,
  },
};

export const darkTheme: Theme = {
  name: 'dark',
  ...shared,
  colors: {
    background: palette.gray950,
    surface: palette.gray900,
    surfaceMuted: palette.gray800,
    text: palette.gray50,
    textMuted: palette.gray400,
    border: palette.gray700,
    primary: palette.blue500,
    primaryText: palette.white,
    primarySubtle: palette.blue900,
    success: palette.green400,
    successSubtle: palette.green900,
    warning: palette.amber400,
    warningSubtle: palette.amber900,
    danger: palette.red400,
    dangerSubtle: palette.red900,
  },
};

/** Build a custom theme by overriding colors of an existing one. */
export function createTheme(
  base: Theme,
  overrides: { name: string; colors?: Partial<ThemeColors> },
): Theme {
  return { ...base, name: overrides.name, colors: { ...base.colors, ...overrides.colors } };
}
