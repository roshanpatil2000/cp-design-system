import type { Preview } from '@storybook/react-vite';
import {
  ThemeProvider,
  atlassianTheme,
  atlassianWebFontFamilies,
  createTheme,
  type MotionPreference,
  type ThemePair,
} from 'cp-design-system';

/** Brand presets for the toolbar. "Atlassian" is the untouched default theme. */
const brands: Record<string, ThemePair> = {
  Atlassian: atlassianTheme,
  Violet: createTheme({ brand: '#7C3AED' }),
  Crimson: createTheme({ brand: '#E5484D' }),
  Emerald: createTheme({ brand: '#0E9F6E' }),
  Amber: createTheme({ brand: '#F5B800' }),
};

const preview: Preview = {
  globalTypes: {
    colorMode: {
      description: 'Color mode',
      toolbar: { title: 'Mode', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
    brand: {
      description: 'Brand theme',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: Object.keys(brands),
        dynamicTitle: true,
      },
    },
    motion: {
      description: 'Motion preference',
      toolbar: {
        title: 'Motion',
        icon: 'lightning',
        items: ['system', 'full', 'reduced'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { colorMode: 'light', brand: 'Atlassian', motion: 'system' },
  decorators: [
    (Story, context) => {
      const mode = context.globals.colorMode === 'dark' ? 'dark' : 'light';
      const pair = brands[context.globals.brand as string] ?? atlassianTheme;
      const theme = pair[mode];
      return (
        <ThemeProvider
          theme={pair}
          colorMode={mode}
          motion={context.globals.motion as MotionPreference}
        >
          <div
            style={{
              background: theme.color['elevation.surface'],
              color: theme.color['color.text'],
              padding: 24,
              minHeight: '100vh',
              boxSizing: 'border-box',
              fontFamily: atlassianWebFontFamilies.body,
            }}
          >
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
  parameters: { layout: 'fullscreen' },
};

export default preview;
