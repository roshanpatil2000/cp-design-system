import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';
import { getAnimatedStyle } from 'react-native-reanimated';
import { ThemeProvider, Toggle, createTheme, type ThemePair } from '../../index.native';
import type { ToggleProps } from './Toggle.types';

/** Gesture callbacks reach JS on a microtask (scheduleOnRN); let them run. */
const flush = () => act(async () => {});

async function setup(
  props: Partial<ToggleProps> = {},
  options: { theme?: ThemePair; motion?: 'full' | 'reduced'; haptics?: () => void } = {},
) {
  const onChange = jest.fn();
  const ui = (p: Partial<ToggleProps>) => (
    <ThemeProvider
      theme={options.theme}
      motion={options.motion ?? 'reduced'}
      haptics={options.haptics}
    >
      <Toggle label="Wi-Fi" testID="t" onChange={onChange} {...p} />
    </ThemeProvider>
  );
  const utils = await render(ui(props));
  return { onChange, rerender: (p: Partial<ToggleProps>) => utils.rerender(ui(p)) };
}

const tap = async () => {
  fireGestureHandler(getByGestureTestId('t-tap'), [
    { state: State.BEGAN },
    { state: State.ACTIVE },
    { state: State.END },
  ]);
  await flush();
};

const drag = async (translationX: number, velocityX = 0) => {
  fireGestureHandler(getByGestureTestId('t-pan'), [
    { state: State.BEGAN, translationX: 0 },
    { state: State.ACTIVE, translationX: translationX / 2 },
    { state: State.ACTIVE, translationX, velocityX },
    { state: State.END, translationX, velocityX },
  ]);
  await flush();
};

const switchEl = () => screen.getByRole('switch', { name: 'Wi-Fi' });
const checkedState = () => switchEl().props.accessibilityState.checked;

describe('Toggle (native)', () => {
  it('renders an accessible switch', async () => {
    await setup();
    expect(switchEl().props.accessibilityState).toEqual({
      checked: false,
      disabled: false,
      busy: false,
    });
  });

  it('toggles on tap (uncontrolled)', async () => {
    const { onChange } = await setup({ defaultChecked: true });
    expect(checkedState()).toBe(true);
    await tap();
    expect(checkedState()).toBe(false);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('stays put until a controlled parent updates isChecked', async () => {
    const { onChange, rerender } = await setup({ isChecked: false });
    await tap();
    expect(onChange).toHaveBeenCalledWith(true);
    expect(checkedState()).toBe(false);
    await rerender({ isChecked: true });
    expect(checkedState()).toBe(true);
  });

  it('toggles by dragging past halfway, and ignores a short drag', async () => {
    const { onChange } = await setup();
    await drag(5); // 5 of 16px
    expect(onChange).not.toHaveBeenCalled();
    await drag(12); // 12 of 16px
    expect(onChange).toHaveBeenCalledWith(true);
    expect(checkedState()).toBe(true);
  });

  it('decides a quick flick by its direction, even if short', async () => {
    const { onChange } = await setup();
    await drag(4, 900);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('can be toggled by screen readers', async () => {
    const { onChange } = await setup();
    await fireEvent(switchEl(), 'accessibilityAction', { nativeEvent: { actionName: 'activate' } });
    await flush();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('ignores every input while disabled or loading', async () => {
    const { onChange, rerender } = await setup({ isDisabled: true });
    expect(switchEl().props.accessibilityState.disabled).toBe(true);
    await tap();
    await drag(14);
    await fireEvent(switchEl(), 'accessibilityAction', { nativeEvent: { actionName: 'activate' } });
    await rerender({ isLoading: true });
    expect(switchEl().props.accessibilityState.busy).toBe(true);
    await tap();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('emits a selection haptic on change', async () => {
    const haptics = jest.fn();
    await setup({}, { haptics });
    await tap();
    expect(haptics).toHaveBeenCalledWith('selection');
  });

  it('uses Atlassian sizes and colors, the brand color, and token overrides', async () => {
    const theme = createTheme({
      brand: '#7C3AED',
      components: { Toggle: { tokens: { trackOff: '#123456' } } },
    });
    await setup({}, { theme });
    let style = StyleSheet.flatten(switchEl().props.style);
    expect(style).toMatchObject({ width: 32, height: 16 });
    // Reanimated reports interpolated colors as rgba().
    expect(getAnimatedStyle(switchEl()).backgroundColor).toBe('rgba(18, 52, 86, 1)'); // #123456

    // Fresh mount: Jest's Reanimated mock doesn't re-run style closures on prop changes the way
    // the real runtime does, so live re-theming is verified on the iOS simulator instead.
    await screen.unmount();
    await setup({ appearance: 'brand', size: 'large', isChecked: true }, { theme });
    style = StyleSheet.flatten(switchEl().props.style);
    expect(style).toMatchObject({ width: 40, height: 20 });
    expect(getAnimatedStyle(switchEl()).backgroundColor).toBe('rgba(124, 58, 237, 1)'); // #7C3AED
  });

  describe('animation timing', () => {
    // Reanimated's test runtime advances animations on timers; drive them frame by frame.
    // Microtasks stay real so gesture callbacks (scheduleOnRN) still run.
    beforeEach(() => {
      jest.useFakeTimers({ doNotFake: ['queueMicrotask', 'nextTick'] });
    });
    afterEach(() => {
      jest.useRealTimers();
    });

    const FRAME = 16;
    const advance = (ms: number) =>
      act(async () => {
        jest.advanceTimersByTime(ms);
      });
    const thumbX = () =>
      (getAnimatedStyle(screen.getByTestId('t-thumb')).transform as { translateX?: number }[])[0]
        ?.translateX;

    it('jumps to the end at once with reduced motion', async () => {
      await setup({}, { motion: 'reduced' });
      await tap();
      await advance(2 * FRAME);
      expect(thumbX()).toBe(18); // 2px inset + 16px travel
    });

    it('springs there over several frames with full motion', async () => {
      await setup({}, { motion: 'full' });
      await tap();
      await advance(2 * FRAME);
      const midway = thumbX()!;
      expect(midway).toBeGreaterThan(2);
      expect(midway).toBeLessThan(18);
      await advance(1500);
      expect(thumbX()).toBeCloseTo(18, 1);
    });
  });
});
