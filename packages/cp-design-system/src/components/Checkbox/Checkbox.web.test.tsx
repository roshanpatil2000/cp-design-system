import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Checkbox,
  ThemeProvider,
  createTheme,
  getCheckboxTokens,
  type CheckboxProps,
  type ThemePair,
} from '../../index.web';

afterEach(cleanup);

function rgb(hex: string) {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  const a = n.length === 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1;
  return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`;
}

const frames = () =>
  act(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
  );

function setup(
  props: Partial<CheckboxProps> = {},
  options: { theme?: ThemePair; haptics?: () => void } = {},
) {
  const onChange = vi.fn();
  const utils = render(
    <ThemeProvider theme={options.theme} motion="reduced" haptics={options.haptics}>
      <Checkbox label="Remember me" testID="c" onChange={onChange} {...props} />
    </ThemeProvider>,
  );
  return { onChange, ...utils };
}

const input = () => screen.getByRole<HTMLInputElement>('checkbox', { name: /Remember me/ });
const box = () => document.querySelector<HTMLElement>('[data-part="box"]')!;
const tokens = getCheckboxTokens(createTheme().light);

describe('Checkbox (web)', () => {
  it('toggles on click when uncontrolled and reports the new state', async () => {
    const haptics = vi.fn();
    const { onChange } = setup({}, { haptics });
    expect(input().checked).toBe(false);
    await userEvent.click(screen.getByText('Remember me'));
    expect(input().checked).toBe(true);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(haptics).toHaveBeenCalledWith('selection');
    await userEvent.click(input());
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('toggles with Space', async () => {
    const { onChange } = setup();
    input().focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('follows the parent when controlled', async () => {
    const { onChange } = setup({ isChecked: false });
    await userEvent.click(input());
    expect(onChange).toHaveBeenCalledWith(true);
    expect(input().checked).toBe(false);

    function Controlled() {
      const [on, setOn] = useState(true);
      return <Checkbox label="Controlled" isChecked={on} onChange={setOn} />;
    }
    render(<Controlled />);
    const c = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Controlled' });
    expect(c.checked).toBe(true);
    await userEvent.click(c);
    expect(c.checked).toBe(false);
  });

  it('shows the mixed state and selects from it', async () => {
    const { onChange } = setup({ isIndeterminate: true, isChecked: false });
    expect(input().getAttribute('aria-checked')).toBe('mixed');
    expect(input().indeterminate).toBe(true);
    await frames();
    expect(document.querySelector<HTMLElement>('[data-part="dash"]')!.style.opacity).toBe('1');
    expect(document.querySelector<HTMLElement>('[data-part="tick"]')!.style.opacity).toBe('0');
    await userEvent.click(input());
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('ignores input when disabled', async () => {
    const { onChange } = setup({ isDisabled: true });
    expect((input() as HTMLInputElement).disabled).toBe(true);
    await userEvent.click(screen.getByText('Remember me'));
    expect(onChange).not.toHaveBeenCalled();
    await frames();
    expect(box().style.backgroundColor).toBe(rgb(tokens.disabledBackground));
  });

  it('fills with the selected color when checked and shows the tick', async () => {
    setup({ defaultChecked: true });
    await frames();
    expect(box().style.backgroundColor).toBe(rgb(tokens.checked));
    expect(document.querySelector<HTMLElement>('[data-part="tick"]')!.style.opacity).toBe('1');
  });

  it('marks invalid and required fields', async () => {
    setup({ isInvalid: true, isRequired: true });
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect((input() as HTMLInputElement).required).toBe(true);
    expect(screen.getByText('*')).toBeTruthy();
    await frames();
    expect(box().style.borderColor).toBe(rgb(tokens.borderInvalid));
  });

  it('uses theme and instance token overrides', async () => {
    const theme = createTheme({ components: { Checkbox: { tokens: { checked: '#7C3AED' } } } });
    setup({ defaultChecked: true }, { theme });
    await frames();
    expect(box().style.backgroundColor).toBe(rgb('#7C3AED'));
    cleanup();
    setup({ defaultChecked: true, tokens: { checked: '#00AA55' } }, { theme });
    await frames();
    expect(box().style.backgroundColor).toBe(rgb('#00AA55'));
  });

  it('follows the brand color', async () => {
    const theme = createTheme({ brand: '#E11D48' });
    setup({ defaultChecked: true }, { theme });
    await frames();
    expect(box().style.backgroundColor).toBe(rgb(getCheckboxTokens(theme.light).checked));
  });

  it('submits its value with a form when checked', async () => {
    render(
      <form data-testid="form">
        <Checkbox label="News" name="news" value="yes" defaultChecked />
        <Checkbox label="Ads" name="ads" />
      </form>,
    );
    const data = new FormData(screen.getByTestId<HTMLFormElement>('form'));
    expect(data.get('news')).toBe('yes');
    expect(data.get('ads')).toBeNull();
  });
});
