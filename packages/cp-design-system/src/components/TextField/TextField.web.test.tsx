import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField, ThemeProvider, createTheme, type ThemePair } from '../../index.web';
import { characterCounter } from './useTextField';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

/** jsdom reports colors as rgb() or, with alpha, rgba(). */
function rgb(hex: string) {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  if (n.length === 8) {
    const a = Math.round((parseInt(n.slice(6, 8), 16) / 255) * 100) / 100;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function renderField(
  ui: React.ReactElement,
  options: { theme?: ThemePair; motion?: 'full' | 'reduced' } = {},
) {
  return render(
    <ThemeProvider theme={options.theme} motion={options.motion ?? 'reduced'}>
      {ui}
    </ThemeProvider>,
  );
}

const light = createTheme().light;
const field = () => document.querySelector<HTMLElement>('[data-part="field"]')!;

describe('characterCounter', () => {
  it("uses Atlassian's wording", () => {
    expect(characterCounter(3, undefined, 10)).toEqual({
      text: '7 characters remaining',
      status: 'ok',
    });
    expect(characterCounter(9, undefined, 10)).toEqual({
      text: '1 character remaining',
      status: 'ok',
    });
    expect(characterCounter(12, undefined, 10)).toEqual({
      text: '2 characters too many',
      status: 'tooLong',
    });
    expect(characterCounter(1, 3, 10)).toEqual({
      text: '2 more characters needed',
      status: 'tooShort',
    });
    expect(characterCounter(5, 3)).toBeNull();
  });
});

describe('TextField (web)', () => {
  it('links the label to the input and marks required fields', () => {
    renderField(<TextField label="Email" isRequired />);
    // The asterisk is aria-hidden, so the accessible name is just "Email".
    const input = screen.getByRole('textbox', { name: 'Email' }) as HTMLInputElement;
    expect(input.required).toBe(true);
    expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true');
  });

  it('uses accessibilityLabel when there is no visible label', () => {
    renderField(<TextField accessibilityLabel="Search" />);
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeTruthy();
  });

  it('manages its own text when uncontrolled', async () => {
    const onChange = vi.fn();
    renderField(<TextField label="Name" defaultValue="Ro" onChange={onChange} />);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    await userEvent.type(input, 'shan');
    expect(input.value).toBe('Roshan');
    expect(onChange).toHaveBeenLastCalledWith('Roshan');
  });

  it('follows the value prop when controlled', async () => {
    function Upper() {
      const [v, setV] = useState('');
      return <TextField label="Code" value={v} onChange={(t) => setV(t.toUpperCase())} />;
    }
    renderField(<Upper />);
    const input = screen.getByLabelText('Code') as HTMLInputElement;
    await userEvent.type(input, 'abc');
    expect(input.value).toBe('ABC');
  });

  it('cannot be edited while disabled or read-only', async () => {
    const onChange = vi.fn();
    renderField(<TextField label="A" isDisabled onChange={onChange} />);
    expect((screen.getByLabelText('A') as HTMLInputElement).disabled).toBe(true);
    cleanup();
    renderField(<TextField label="A" isReadOnly defaultValue="fixed" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('A'), 'x');
    expect((screen.getByLabelText('A') as HTMLInputElement).value).toBe('fixed');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows helper, error and valid messages and describes the input with them', async () => {
    const { rerender } = renderField(<TextField label="A" helperMessage="Use your work email" />);
    const input = screen.getByLabelText('A');
    const describedBy = () =>
      (input.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .map((id) => document.getElementById(id)?.textContent);
    expect(describedBy()).toContain('Use your work email');

    rerender(
      <ThemeProvider motion="reduced">
        <TextField
          label="A"
          helperMessage="Use your work email"
          isInvalid
          errorMessage="Enter a valid email"
        />
      </ThemeProvider>,
    );
    await waitFor(() => expect(screen.queryByText('Use your work email')).toBeNull());
    expect(describedBy()).toContain('Enter a valid email');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    rerender(
      <ThemeProvider motion="reduced">
        <TextField label="A" helperMessage="Use your work email" validMessage="Looks good" />
      </ThemeProvider>,
    );
    await waitFor(() => expect(screen.getByText('Looks good')).toBeTruthy());
    expect(document.querySelector('[data-part="message-valid"]')).not.toBeNull();
  });

  it('uses the danger border and a 2px ring when invalid', () => {
    renderField(<TextField label="A" isInvalid />);
    expect(field().style.borderColor).toBe(rgb(light.color['color.border.danger']));
    // jsdom keeps colors inside box-shadow as written (hex).
    expect(field().style.boxShadow.toUpperCase()).toContain(light.color['color.border.danger']);
  });

  it('shows the focused border, ring and background on focus, and the hover background', () => {
    renderField(<TextField label="A" />);
    expect(field().style.borderColor).toBe(rgb(light.color['color.border.input']));
    expect(field().style.boxShadow).toBe('none');
    fireEvent.pointerEnter(field());
    expect(field().style.backgroundColor).toBe(rgb(light.color['color.background.input.hovered']));
    fireEvent.focus(screen.getByLabelText('A'));
    expect(field().style.borderColor).toBe(rgb(light.color['color.border.focused']));
    expect(field().style.boxShadow.toUpperCase()).toContain(light.color['color.border.focused']);
    expect(field().style.backgroundColor).toBe(rgb(light.color['color.background.input.pressed']));
  });

  it('counts characters, flags too many or too few, and announces after typing settles', async () => {
    renderField(<TextField label="Bio" maxCharacters={5} defaultValue="abc" />);
    const counter = () => document.querySelector('[data-part="counter"]')!;
    expect(counter().textContent).toBe('2 characters remaining');
    const input = screen.getByLabelText('Bio');
    await userEvent.type(input, 'defg');
    expect(counter().textContent).toBe('2 characters too many');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const live = document.querySelector('[aria-live="polite"]')!;
    await waitFor(() => expect(live.textContent).toBe('2 characters too many'), { timeout: 1500 });

    cleanup();
    // Too short isn't an error until the user leaves the field.
    renderField(<TextField label="Bio2" minCharacters={4} defaultValue="a" />);
    expect(counter().textContent).toBe('3 more characters needed');
    const bio = screen.getByLabelText('Bio2');
    expect(bio.getAttribute('aria-invalid')).toBeNull();
    fireEvent.focus(bio);
    fireEvent.blur(bio);
    expect(bio.getAttribute('aria-invalid')).toBe('true');
  });

  it('shakes when it becomes invalid, only with motion on', async () => {
    function Form({ invalid }: { invalid: boolean }) {
      return <TextField label="A" isInvalid={invalid} errorMessage="Required" />;
    }
    const { rerender } = renderField(<Form invalid={false} />, { motion: 'full' });
    const offsets: string[] = [];
    const observer = new MutationObserver(() => offsets.push(field().style.transform));
    observer.observe(field(), { attributes: true, attributeFilter: ['style'] });
    rerender(
      <ThemeProvider motion="full">
        <Form invalid />
      </ThemeProvider>,
    );
    await waitFor(() => expect(offsets.some((o) => /translateX\(-?[1-9]/.test(o))).toBe(true), {
      timeout: 2000,
    });
    observer.disconnect();
    cleanup();

    const { rerender: rerender2 } = renderField(<Form invalid={false} />, { motion: 'reduced' });
    rerender2(
      <ThemeProvider motion="reduced">
        <Form invalid />
      </ThemeProvider>,
    );
    await act(() => new Promise((r) => setTimeout(r, 400)));
    expect(field().style.transform).toBe('');
  });

  it("uses Atlassian's sizes, and 16px text on touch phones", () => {
    const { unmount } = renderField(<TextField label="A" />);
    const input = () => screen.getByLabelText('A') as HTMLInputElement;
    expect(input().style.fontSize).toBe('14px');
    expect([input().style.paddingTop, input().style.paddingLeft]).toEqual(['8px', '6px']);
    expect(field().style.borderRadius).toBe('6px');
    unmount();

    renderField(<TextField label="A" isCompact />);
    expect([input().style.paddingTop, input().style.paddingLeft]).toEqual(['4px', '6px']);
    cleanup();

    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('pointer: coarse'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    renderField(<TextField label="A" />);
    expect(input().style.fontSize).toBe('16px');
    // Same 40px height with the larger line: 6px padding instead of 8px.
    expect([input().style.paddingTop, input().style.paddingLeft]).toEqual(['6px', '6px']);
  });

  it('maps type, submits on Enter, and applies width presets', async () => {
    const onSubmit = vi.fn();
    renderField(<TextField label="Pass" type="password" width="medium" onSubmit={onSubmit} />);
    const input = screen.getByLabelText('Pass') as HTMLInputElement;
    expect(input.type).toBe('password');
    await userEvent.type(input, 'x{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(
      (document.querySelector('[data-part="field"]')!.parentElement as HTMLElement).style.maxWidth,
    ).toBe('240px');
  });

  it('renders content before and after the input', () => {
    renderField(
      <TextField
        label="Search"
        elemBeforeInput={<i data-testid="before" />}
        elemAfterInput={<i data-testid="after" />}
      />,
    );
    expect(screen.getByTestId('before')).toBeTruthy();
    expect(screen.getByTestId('after')).toBeTruthy();
  });

  it('applies theme defaults and token overrides, with instance tokens winning', () => {
    const theme = createTheme({
      components: {
        TextField: { defaultProps: { isCompact: true }, tokens: { radius: 12, paddingX: 10 } },
      },
    });
    renderField(<TextField label="A" tokens={{ paddingX: 14 }} />, { theme });
    expect(field().style.borderRadius).toBe('12px');
    expect((screen.getByLabelText('A') as HTMLInputElement).style.padding).toBe('4px 14px');
  });
});
