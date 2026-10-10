import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { getAnimatedStyle } from 'react-native-reanimated';
import { RadioGroup, ThemeProvider, createTheme, type ThemePair } from '../../index.native';
import type { RadioGroupProps } from './Radio.types';

const options = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue', isDisabled: true },
];

async function setup(props: Partial<RadioGroupProps> = {}, theme?: ThemePair) {
  const onChange = jest.fn();
  const ui = (p: Partial<RadioGroupProps>) => (
    <ThemeProvider theme={theme} motion="reduced">
      <RadioGroup
        label="Color"
        options={options}
        onChange={onChange}
        testID="g"
        {...props}
        {...p}
      />
    </ThemeProvider>
  );
  const utils = await render(ui({}));
  return { onChange, rerender: (p: Partial<RadioGroupProps>) => utils.rerender(ui(p)) };
}

const radio = (name: string) => screen.getByRole('radio', { name });

describe('RadioGroup (native)', () => {
  it('renders a labelled radiogroup', async () => {
    await setup();
    // Not `accessible`, so iOS keeps each radio separately focusable inside the group.
    const group = screen.getByTestId('g');
    expect(group.props.accessibilityRole).toBe('radiogroup');
    expect(group.props.accessibilityLabel).toBe('Color');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('selects on press when uncontrolled and animates the dot', async () => {
    const { onChange } = await setup();
    await fireEvent.press(radio('Green'));
    expect(onChange).toHaveBeenCalledWith('green');
    expect(radio('Green').props.accessibilityState.checked).toBe(true);
    expect(getAnimatedStyle(screen.getByTestId('g-green-dot')).opacity).toBe(1);
    expect(getAnimatedStyle(screen.getByTestId('g-red-dot')).opacity).toBe(0);
    await fireEvent.press(radio('Green'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('follows the parent when controlled', async () => {
    const { onChange, rerender } = await setup({ value: 'red' });
    await fireEvent.press(radio('Green'));
    expect(onChange).toHaveBeenCalledWith('green');
    expect(radio('Red').props.accessibilityState.checked).toBe(true);
    await rerender({ value: 'green' });
    expect(radio('Green').props.accessibilityState.checked).toBe(true);
  });

  it('disables single options or the whole group', async () => {
    const { onChange, rerender } = await setup();
    await fireEvent.press(radio('Blue'));
    expect(onChange).not.toHaveBeenCalled();
    await rerender({ isDisabled: true });
    expect(screen.getAllByRole('radio').every((r) => r.props.accessibilityState.disabled)).toBe(
      true,
    );
  });

  it('colors the selected radio from the theme', async () => {
    const theme = createTheme({ components: { Radio: { tokens: { checked: '#7C3AED' } } } });
    await setup({ defaultValue: 'red' }, theme);
    expect(getAnimatedStyle(screen.getByTestId('g-red-circle')).backgroundColor).toBe('#7C3AED');
  });
});
