import type { Preview } from '@storybook/react-vite';
import { ThemeProvider, darkTheme, lightTheme } from 'cp-design-system';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Design system theme',
      toolbar: { icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      const mode = context.globals.theme === 'dark' ? 'dark' : 'light';
      const theme = mode === 'dark' ? darkTheme : lightTheme;
      return (
        <ThemeProvider theme={mode}>
          <div
            style={{
              background: theme.colors.background,
              padding: 24,
              minHeight: '100vh',
              boxSizing: 'border-box',
              fontFamily: 'system-ui, -apple-system, sans-serif',
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
