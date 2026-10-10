import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { getAnimatedStyle } from 'react-native-reanimated';
import { Checkbox, ThemeProvider, createTheme, type ThemePair } from '../../index.native';
import type { CheckboxProps } from './Checkbox.types';

async function setup(
  props: Partial<CheckboxProps> = {},
  options: { theme?: ThemePair; haptics?: () => void } = {},
) {
  const onChange = jest.fn();
  const ui = (p: Partial<CheckboxProps>) => (
    <ThemeProvider theme={options.theme} motion="reduced" haptics={options.haptics}>
      <Checkbox label="Remember me" testID="c" onChange={onChange} {...props} {...p} />
    </ThemeProvider>
  );
  const utils = await render(ui({}));
  return { onChange, rerender: (p: Partial<CheckboxProps>) => utils.rerender(ui(p)) };
}

const box = () => screen.getByRole('checkbox', { name: 'Remember me' });
const state = () => box().props.accessibilityState;

describe('Checkbox (native)', () => {
  it('renders an accessible checkbox with a visible label', async () => {
    await setup();
    expect(state()).toEqual({ checked: false, disabled: false });
    expect(screen.getByText('Remember me')).toBeTruthy();
  });

  it('toggles on press when uncontrolled, with a haptic tick', async () => {
    const haptics = jest.fn();
    const { onChange } = await setup({}, { haptics });
    await fireEvent.press(box());
    expect(state().checked).toBe(true);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(haptics).toHaveBeenCalledWith('selection');
    expect(getAnimatedStyle(screen.getByTestId('c-tick')).opacity).toBe(1);
    await fireEvent.press(box());
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(getAnimatedStyle(screen.getByTestId('c-tick')).opacity).toBe(0);
  });

  it('follows the parent when controlled', async () => {
    const { onChange, rerender } = await setup({ isChecked: false });
    await fireEvent.press(box());
    expect(onChange).toHaveBeenCalledWith(true);
    expect(state().checked).toBe(false);
    await rerender({ isChecked: true });
    expect(state().checked).toBe(true);
  });

  it('reports mixed and shows the dash when indeterminate', async () => {
    const { onChange } = await setup({ isIndeterminate: true, isChecked: false });
    expect(state().checked).toBe('mixed');
    expect(getAnimatedStyle(screen.getByTestId('c-dash')).opacity).toBe(1);
    expect(getAnimatedStyle(screen.getByTestId('c-tick')).opacity).toBe(0);
    await fireEvent.press(box());
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('ignores presses when disabled', async () => {
    const { onChange } = await setup({ isDisabled: true });
    expect(state().disabled).toBe(true);
    await fireEvent.press(box());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses the selected, invalid and custom colors', async () => {
    const theme = createTheme({ components: { Checkbox: { tokens: { checked: '#7C3AED' } } } });
    const { rerender } = await setup({ defaultChecked: true }, { theme });
    expect(getAnimatedStyle(screen.getByTestId('c-box')).backgroundColor).toBe('#7C3AED');
    await rerender({ defaultChecked: true, tokens: { checked: '#123456' } });
    expect(getAnimatedStyle(screen.getByTestId('c-box')).backgroundColor).toBe('#123456');
    await rerender({
      isChecked: false,
      isInvalid: true,
      tokens: { borderInvalid: '#FF0000' },
    });
    expect(getAnimatedStyle(screen.getByTestId('c-box')).borderColor).toBe('#FF0000');
  });

  it('shows a required marker', async () => {
    await setup({ isRequired: true });
    expect(screen.getByText(/\*/)).toBeTruthy();
  });
});
