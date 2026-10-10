import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { getAnimatedStyle } from 'react-native-reanimated';
import { TextField, ThemeProvider, createTheme, type ThemePair } from '../../index.native';
import type { TextFieldProps } from './TextField.types';

/** Reanimated reports interpolated colors as rgba(). */
function rgba(hex: string) {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  const a = n.length === 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const light = createTheme().light;
type Styled = Parameters<typeof getAnimatedStyle>[0];

async function setup(
  props: Partial<TextFieldProps> = {},
  options: { theme?: ThemePair; motion?: 'full' | 'reduced' } = {},
) {
  const onChange = jest.fn();
  const utils = await render(
    <ThemeProvider theme={options.theme} motion={options.motion ?? 'reduced'}>
      <TextField testID="tf" label="Email" onChange={onChange} {...props} />
    </ThemeProvider>,
  );
  return { onChange, ...utils };
}

const input = () => screen.getByTestId('tf-input');
const fieldEl = () => screen.getByTestId('tf-field') as unknown as Styled;
const inputStyle = () => StyleSheet.flatten(input().props.style);

describe('TextField (native)', () => {
  it('labels the input for screen readers and shows a required asterisk', async () => {
    await setup({ isRequired: true });
    expect(input().props.accessibilityLabel).toBe('Email');
    expect(input().props['aria-required']).toBe(true);
    expect(screen.getByText(' *')).toBeTruthy();
  });

  it('lets the native input own its text when uncontrolled', async () => {
    const { onChange } = await setup({ defaultValue: 'ro', maxCharacters: 30 });
    // No value prop is passed down, so fast typing can't be overwritten by a stale JS value.
    expect(input().props.value).toBeUndefined();
    expect(input().props.defaultValue).toBe('ro');
    await fireEvent.changeText(input(), 'roshan@example.com');
    expect(onChange).toHaveBeenCalledWith('roshan@example.com');
    expect(screen.getByText('12 characters remaining')).toBeTruthy(); // still tracked for the counter
  });

  it('follows the value prop when controlled', async () => {
    function Upper() {
      const [v, setV] = useState('');
      return (
        <TextField testID="tf" label="Code" value={v} onChange={(t) => setV(t.toUpperCase())} />
      );
    }
    await render(<Upper />);
    await fireEvent.changeText(input(), 'abc');
    expect(input().props.value).toBe('ABC');
  });

  it('is not editable while disabled or read-only', async () => {
    const { onChange } = await setup({ isDisabled: true });
    expect(input().props.editable).toBe(false);
    await fireEvent.changeText(input(), 'x');
    expect(onChange).not.toHaveBeenCalled();
    await screen.unmount();
    await setup({ isReadOnly: true });
    expect(input().props.editable).toBe(false);
  });

  it('shows the right message and puts it in the accessibility hint', async () => {
    await setup({ helperMessage: 'Use your work email' });
    expect(screen.getByTestId('tf-message-helper')).toBeTruthy();
    expect(input().props.accessibilityHint).toBe('Use your work email');
    await screen.unmount();

    await setup({
      helperMessage: 'Use your work email',
      isInvalid: true,
      errorMessage: 'Enter a valid email',
    });
    expect(screen.queryByTestId('tf-message-helper')).toBeNull();
    expect(screen.getByText('Enter a valid email')).toBeTruthy();
    expect(input().props['aria-invalid']).toBe(true);
    await screen.unmount();

    await setup({ validMessage: 'Looks good' });
    expect(screen.getByTestId('tf-message-valid')).toBeTruthy();
  });

  it('counts characters and turns invalid when there are too many', async () => {
    await setup({ maxCharacters: 5, defaultValue: 'abc' });
    expect(screen.getByText('2 characters remaining')).toBeTruthy();
    await fireEvent.changeText(input(), 'abcdefg');
    expect(screen.getByText('2 characters too many')).toBeTruthy();
    expect(input().props['aria-invalid']).toBe(true);
    expect(input().props.accessibilityHint).toBe('2 characters too many');
  });

  it('flags too few characters only after the field is left', async () => {
    await setup({ minCharacters: 4, defaultValue: 'a' });
    expect(screen.getByText('3 more characters needed')).toBeTruthy();
    expect(input().props['aria-invalid']).toBe(false);
    await fireEvent(input(), 'blur');
    expect(input().props['aria-invalid']).toBe(true);
  });

  it('maps the type to the right keyboard', async () => {
    await setup({ type: 'email' });
    expect(input().props).toMatchObject({ keyboardType: 'email-address', autoCapitalize: 'none' });
    await screen.unmount();
    await setup({ type: 'password' });
    expect(input().props.secureTextEntry).toBe(true);
    await screen.unmount();
    await setup({ type: 'number' });
    expect(input().props.keyboardType).toBe('numeric');
  });

  it('uses 16/24 text and keeps the 40px / 32px height', async () => {
    await setup();
    expect(inputStyle()).toMatchObject({ fontSize: 16, height: 36 }); // 40 minus 2px border and 2px inset
    await screen.unmount();
    await setup({ isCompact: true });
    expect(inputStyle()).toMatchObject({ fontSize: 16, height: 28 });
  });

  it('calls onSubmit from the return key', async () => {
    const onSubmit = jest.fn();
    await setup({ onSubmit });
    await fireEvent(input(), 'submitEditing');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('applies theme defaults and token overrides, with instance tokens winning', async () => {
    const theme = createTheme({
      components: {
        TextField: { defaultProps: { isCompact: true }, tokens: { radius: 12, paddingX: 10 } },
      },
    });
    await setup({ tokens: { paddingX: 14 } }, { theme });
    expect(inputStyle()).toMatchObject({ paddingHorizontal: 14, height: 28 });
    const fieldStyle = StyleSheet.flatten((fieldEl() as { props: { style: object } }).props.style);
    expect(fieldStyle).toMatchObject({ borderRadius: 12 });
  });

  describe('motion', () => {
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
    const shakeX = () =>
      (getAnimatedStyle(fieldEl()).transform as { translateX?: number }[] | undefined)?.[0]
        ?.translateX ?? 0;

    it('fades the border to the focused color on focus', async () => {
      await setup({}, { motion: 'full' });
      expect(getAnimatedStyle(fieldEl()).borderColor).toBe(rgba(light.color['color.border.input']));
      await fireEvent(input(), 'focus');
      await advance(300);
      expect(getAnimatedStyle(fieldEl()).borderColor).toBe(
        rgba(light.color['color.border.focused']),
      );
      await fireEvent(input(), 'blur');
      await advance(300);
      expect(getAnimatedStyle(fieldEl()).borderColor).toBe(rgba(light.color['color.border.input']));
    });

    it('uses the danger border when invalid', async () => {
      await setup({ isInvalid: true });
      expect(getAnimatedStyle(fieldEl()).borderColor).toBe(
        rgba(light.color['color.border.danger']),
      );
    });

    it('shakes when it becomes invalid with full motion, and not with reduced motion', async () => {
      const ui = (invalid: boolean, motion: 'full' | 'reduced') => (
        <ThemeProvider motion={motion}>
          <TextField testID="tf" label="Email" isInvalid={invalid} errorMessage="Required" />
        </ThemeProvider>
      );
      const { rerender } = await render(ui(false, 'full'));
      await rerender(ui(true, 'full'));
      const seen: number[] = [];
      for (let i = 0; i < 12; i++) {
        await advance(25);
        seen.push(shakeX());
      }
      expect(Math.max(...seen.map(Math.abs))).toBeGreaterThan(1);
      expect(shakeX()).toBeCloseTo(0, 1); // settles back

      const reduced = await render(ui(false, 'reduced'));
      await reduced.rerender(ui(true, 'reduced'));
      await advance(300);
      expect(shakeX()).toBe(0);
    });
  });
});
