import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { StyleSheet, Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { getAnimatedStyle } from 'react-native-reanimated';
import { Button, ThemeProvider, createTheme, type ThemePair } from '../../index.native';
import type { ButtonProps } from './Button.types';

/** Reanimated reports interpolated colors as rgba(). */
function rgba(hex: string) {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  const a = n.length === 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const light = createTheme().light;

async function setup(
  props: Partial<ButtonProps> = {},
  options: { theme?: ThemePair; motion?: 'full' | 'reduced'; haptics?: () => void } = {},
) {
  const onPress = jest.fn();
  await render(
    <ThemeProvider
      theme={options.theme}
      motion={options.motion ?? 'reduced'}
      haptics={options.haptics}
    >
      <Button testID="b" onPress={onPress} {...props}>
        {props.children ?? 'Save'}
      </Button>
    </ThemeProvider>,
  );
  return { onPress };
}

const button = () => screen.getByRole('button');
/** The animated surface (background, border, scale) inside the Pressable. */
const surface = () =>
  screen.getByTestId('b').children[0] as unknown as Parameters<typeof getAnimatedStyle>[0];

describe('Button (native)', () => {
  it('renders an accessible button with its label', async () => {
    await setup();
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
    expect(button().props.accessibilityState).toMatchObject({ disabled: false, busy: false });
  });

  it('calls onPress when tapped', async () => {
    const { onPress } = await setup();
    await fireEvent.press(button());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores presses while disabled', async () => {
    const { onPress } = await setup({ isDisabled: true });
    expect(button().props.accessibilityState.disabled).toBe(true);
    await fireEvent.press(button());
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows a spinner while loading and ignores presses', async () => {
    const { onPress } = await setup({ isLoading: true });
    expect(button().props.accessibilityState).toMatchObject({ busy: true, disabled: true });
    expect(screen.getByTestId('b-spinner')).toBeTruthy();
    expect(screen.getByText('Save')).toBeTruthy(); // label keeps its space
    await fireEvent.press(button());
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes isSelected and uses the selected colors', async () => {
    await setup({ isSelected: true });
    expect(button().props.accessibilityState.selected).toBe(true);
    expect(getAnimatedStyle(surface()).backgroundColor).toBe(
      rgba(light.color['color.background.selected']),
    );
  });

  it("uses Atlassian's primary colors, height and radius", async () => {
    await setup({ appearance: 'primary' });
    expect(getAnimatedStyle(surface()).backgroundColor).toBe(
      rgba(light.color['color.background.brand.bold']),
    );
    expect(StyleSheet.flatten(screen.getByText('Save').props.style)).toMatchObject({
      color: light.color['color.text.onBrand'],
      fontSize: 14,
      fontWeight: '500',
    });
    const style = StyleSheet.flatten((surface() as { props: { style: object } }).props.style);
    expect(style).toMatchObject({ height: 32, borderRadius: 6, borderWidth: 0 });
  });

  it('is compact at 24px with a 1px border on the default appearance', async () => {
    await setup({ spacing: 'compact' });
    const style = StyleSheet.flatten((surface() as { props: { style: object } }).props.style);
    expect(style).toMatchObject({
      height: 24,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: light.color['color.border'],
    });
  });

  it('renders non-text children as they are', async () => {
    await setup({ children: <Text testID="custom">Custom</Text> });
    expect(screen.getByTestId('custom')).toBeTruthy();
  });

  it('passes the current color and size to icon functions', async () => {
    const icon = jest.fn(({ color, size }: { color: string; size: number }) => (
      <Text testID="icon">{`${color}|${size}`}</Text>
    ));
    await setup({ appearance: 'danger', iconBefore: icon });
    expect(screen.getByTestId('icon')).toHaveTextContent(`${light.color['color.text.inverse']}|16`);
  });

  it('emits an impactLight haptic on press', async () => {
    const haptics = jest.fn();
    await setup({}, { haptics });
    await fireEvent.press(button());
    expect(haptics).toHaveBeenCalledWith('impactLight');
  });

  it('applies theme defaults and token overrides', async () => {
    const theme = createTheme({
      components: { Button: { defaultProps: { appearance: 'danger' }, tokens: { radius: 999 } } },
    });
    await setup({ tokens: { height: 40 } }, { theme });
    const style = StyleSheet.flatten((surface() as { props: { style: object } }).props.style);
    expect(style).toMatchObject({ borderRadius: 999, height: 40 });
    expect(getAnimatedStyle(surface()).backgroundColor).toBe(
      rgba(theme.light.color['color.background.danger.bold']),
    );
  });

  describe('press animation', () => {
    beforeEach(() => {
      jest.useFakeTimers({ doNotFake: ['queueMicrotask', 'nextTick'] });
    });
    afterEach(() => {
      jest.useRealTimers();
    });
    const advance = (ms: number) =>
      act(async () => {
        jest.advanceTimersByTime(ms);
      });
    const scale = () =>
      (getAnimatedStyle(surface()).transform as { scale?: number }[] | undefined)?.[0]?.scale;

    it('shows the pressed color at once and never scales with reduced motion', async () => {
      await setup({ appearance: 'primary' }, { motion: 'reduced' });
      await fireEvent(button(), 'pressIn');
      await advance(32);
      expect(getAnimatedStyle(surface()).backgroundColor).toBe(
        rgba(light.color['color.background.brand.bold.pressed']),
      );
      expect(scale()).toBe(1);
    });

    it('springs down to the press scale and back with full motion', async () => {
      await setup({ appearance: 'primary' }, { motion: 'full' });
      await fireEvent(button(), 'pressIn');
      await advance(32);
      const midway = scale()!;
      expect(midway).toBeLessThan(1);
      expect(midway).toBeGreaterThan(0.96);
      await advance(1000);
      expect(scale()).toBeCloseTo(0.96, 2);
      await fireEvent(button(), 'pressOut');
      await advance(1000);
      expect(scale()).toBeCloseTo(1, 2);
    });
  });
});
