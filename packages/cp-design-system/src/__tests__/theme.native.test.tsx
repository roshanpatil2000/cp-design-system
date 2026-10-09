import { describe, expect, it, jest } from '@jest/globals';
import * as ReactNative from 'react-native';
import { AccessibilityInfo, Text } from 'react-native';
import { render, screen, waitFor } from '@testing-library/react-native';
import { ThemeProvider, createTheme, useReducedMotion, useTheme } from '../index.native';

function Probe() {
  const theme = useTheme();
  const reduced = useReducedMotion();
  return <Text testID="probe">{`${theme.name}:${theme.mode}:${reduced}`}</Text>;
}

describe('ThemeProvider (native)', () => {
  it('defaults to Atlassian light with full motion', async () => {
    await render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('atlassian:light:false');
  });

  it('follows the OS color scheme when colorMode is "system"', async () => {
    const spy = jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
    await render(
      <ThemeProvider theme={createTheme({ brand: '#7C3AED' })} colorMode="system">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('brand:dark:false');
    spy.mockRestore();
  });

  it('respects the OS reduce-motion setting unless motion="full"', async () => {
    const spy = jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const { rerender } = await render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await waitFor(() =>
      expect(screen.getByTestId('probe')).toHaveTextContent('atlassian:light:true'),
    );
    await rerender(
      <ThemeProvider motion="full">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('atlassian:light:false');
    spy.mockRestore();
  });
});
