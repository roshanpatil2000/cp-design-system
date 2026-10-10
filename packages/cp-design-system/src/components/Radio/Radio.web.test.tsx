import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Radio,
  RadioGroup,
  ThemeProvider,
  createTheme,
  getRadioTokens,
  type RadioGroupProps,
} from '../../index.web';

afterEach(cleanup);

const frames = () =>
  act(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
  );

const options = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue', isDisabled: true },
];

function setup(props: Partial<RadioGroupProps> = {}) {
  const onChange = vi.fn();
  render(
    <ThemeProvider motion="reduced">
      <RadioGroup label="Color" options={options} onChange={onChange} testID="g" {...props} />
    </ThemeProvider>,
  );
  return { onChange };
}

const radio = (name: string) => screen.getByRole<HTMLInputElement>('radio', { name });

describe('RadioGroup (web)', () => {
  it('renders a labelled group of radios sharing one name', () => {
    setup();
    expect(screen.getByRole('radiogroup', { name: 'Color' })).toBeTruthy();
    const names = screen.getAllByRole<HTMLInputElement>('radio').map((r) => r.name);
    expect(new Set(names).size).toBe(1);
    expect(names[0]).not.toBe('');
  });

  it('selects on click when uncontrolled', async () => {
    const { onChange } = setup();
    await userEvent.click(screen.getByText('Green'));
    expect(radio('Green').checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith('green');
    await userEvent.click(radio('Red'));
    expect(radio('Red').checked).toBe(true);
    expect(radio('Green').checked).toBe(false);
  });

  it('moves the selection with arrow keys, skipping disabled options', async () => {
    const { onChange } = setup({ defaultValue: 'red' });
    radio('Red').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('green');
    expect(document.activeElement).toBe(radio('Green'));
  });

  it('follows the parent when controlled', async () => {
    const { onChange } = setup({ value: 'red' });
    await userEvent.click(radio('Green'));
    expect(onChange).toHaveBeenCalledWith('green');
    expect(radio('Red').checked).toBe(true);
  });

  it('disables single options or the whole group', async () => {
    const { onChange } = setup();
    expect((radio('Blue') as HTMLInputElement).disabled).toBe(true);
    await userEvent.click(screen.getByText('Blue'));
    expect(onChange).not.toHaveBeenCalled();
    cleanup();
    setup({ isDisabled: true });
    expect(screen.getAllByRole('radio').every((r) => (r as HTMLInputElement).disabled)).toBe(true);
  });

  it('marks invalid and required groups', () => {
    setup({ isInvalid: true, isRequired: true });
    const group = screen.getByRole('radiogroup');
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-required')).toBe('true');
    expect(radio('Red').getAttribute('aria-invalid')).toBe('true');
  });

  it('pops the dot in when selected', async () => {
    setup({ defaultValue: 'green' });
    await frames();
    const dots = document.querySelectorAll<HTMLElement>('[data-part="dot"]');
    expect(dots[1]!.style.opacity).toBe('1');
    expect(dots[0]!.style.opacity).toBe('0');
  });

  it('submits the selected value with a form', () => {
    render(
      <form data-testid="form">
        <RadioGroup name="size" options={options} defaultValue="green" />
      </form>,
    );
    expect(new FormData(screen.getByTestId<HTMLFormElement>('form')).get('size')).toBe('green');
  });
});

describe('Radio (web)', () => {
  it('reports its value once selected and uses theme tokens', async () => {
    const onChange = vi.fn();
    const theme = createTheme({ components: { Radio: { tokens: { checked: '#7C3AED' } } } });
    render(
      <ThemeProvider theme={theme} motion="reduced">
        <Radio label="Only" value="only" isChecked onChange={onChange} />
        <Radio label="Other" value="other" onChange={onChange} />
      </ThemeProvider>,
    );
    await frames();
    const circle = document.querySelector<HTMLElement>('[data-part="circle"]')!;
    expect(circle.style.backgroundColor).toBe('rgb(124, 58, 237)');
    await userEvent.click(radio('Only'));
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.click(radio('Other'));
    expect(onChange).toHaveBeenCalledWith('other');
    expect(getRadioTokens(theme.light).radius).toBe(9999);
  });
});
