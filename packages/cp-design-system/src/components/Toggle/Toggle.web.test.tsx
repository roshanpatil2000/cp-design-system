import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ThemeProvider,
  Toggle,
  createTheme,
  getToggleTokens,
  type ThemePair,
} from '../../index.web';
import { thumbGeometry } from './Toggle.geometry';

afterEach(cleanup);

/** jsdom reports colors as rgb()/rgba(); compare in that form. */
function rgb(hex: string) {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
}

function renderToggle(
  ui: React.ReactElement,
  options: { theme?: ThemePair; motion?: 'full' | 'reduced' } = {},
) {
  return render(
    <ThemeProvider theme={options.theme} motion={options.motion ?? 'reduced'}>
      {ui}
    </ThemeProvider>,
  );
}

const thumb = () => document.querySelector<HTMLElement>('[data-part="thumb"]')!;

/** Motion writes styles on the next animation frame; wait two to be safe. */
const frames = () =>
  act(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
  );

describe('thumbGeometry', () => {
  it('keeps the thumb inside the track, even when a spring overshoots', () => {
    for (const size of ['regular', 'large'] as const) {
      const t = getToggleTokens(createTheme().light, size, 'success');
      for (let progress = -0.6; progress <= 1.6; progress += 0.05) {
        for (const press of [0, 0.5, 1]) {
          const { x, width } = thumbGeometry(t, progress, press);
          expect(x).toBeGreaterThanOrEqual(t.thumbInset - 1e-9);
          expect(x + width).toBeLessThanOrEqual(t.width - t.thumbInset + 1e-9);
        }
      }
    }
  });

  it('rests at each end and squishes toward the far side when pressed', () => {
    const t = getToggleTokens(createTheme().light, 'regular', 'success');
    expect(thumbGeometry(t, 0, 0)).toEqual({ x: 2, width: 12 });
    expect(thumbGeometry(t, 1, 0)).toEqual({ x: 18, width: 12 });
    expect(thumbGeometry(t, 0, 1)).toEqual({ x: 2, width: 16 }); // grows right when off
    expect(thumbGeometry(t, 1, 1)).toEqual({ x: 14, width: 16 }); // grows left when on
  });
});

describe('Toggle (web)', () => {
  it('renders an accessible switch', () => {
    renderToggle(<Toggle label="Wi-Fi" />);
    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(toggle.getAttribute('aria-checked')).toBe('false');
  });

  it('respects defaultChecked and toggles itself when uncontrolled', async () => {
    const onChange = vi.fn();
    renderToggle(<Toggle label="Wi-Fi" defaultChecked onChange={onChange} />);
    const toggle = screen.getByRole('switch');
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    await userEvent.click(toggle);
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    await userEvent.click(toggle);
    expect(onChange.mock.calls).toEqual([[false], [true]]);
  });

  it('only changes when the parent updates isChecked (controlled)', async () => {
    const onChange = vi.fn();
    const { rerender } = renderToggle(
      <Toggle label="Wi-Fi" isChecked={false} onChange={onChange} />,
    );
    const toggle = screen.getByRole('switch');
    await userEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    rerender(
      <ThemeProvider motion="reduced">
        <Toggle label="Wi-Fi" isChecked onChange={onChange} />
      </ThemeProvider>,
    );
    expect(toggle.getAttribute('aria-checked')).toBe('true');
  });

  it('works with the keyboard (Space and Enter)', async () => {
    const onChange = vi.fn();
    renderToggle(<Toggle label="Wi-Fi" onChange={onChange} />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('switch'));
    await userEvent.keyboard(' ');
    await userEvent.keyboard('{Enter}');
    expect(onChange.mock.calls).toEqual([[true], [false]]);
  });

  it('ignores input while disabled or loading', async () => {
    const onChange = vi.fn();
    const { rerender } = renderToggle(<Toggle label="Wi-Fi" isDisabled onChange={onChange} />);
    expect((screen.getByRole('switch') as HTMLButtonElement).disabled).toBe(true);
    await userEvent.click(screen.getByRole('switch'));
    rerender(
      <ThemeProvider motion="reduced">
        <Toggle label="Wi-Fi" isLoading onChange={onChange} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('switch').getAttribute('aria-busy')).toBe('true');
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('toggles by dragging past halfway, and not for a short drag', () => {
    const onChange = vi.fn();
    renderToggle(<Toggle label="Wi-Fi" onChange={onChange} />);
    const toggle = screen.getByRole('switch');

    fireEvent.pointerDown(toggle, { button: 0, clientX: 0, pointerId: 1 });
    fireEvent.pointerMove(toggle, { clientX: 5, pointerId: 1 });
    fireEvent.pointerUp(toggle, { clientX: 5, pointerId: 1 });
    fireEvent.click(toggle); // the click that follows a drag must not toggle again
    expect(onChange).not.toHaveBeenCalled();
    expect(toggle.getAttribute('aria-checked')).toBe('false');

    fireEvent.pointerDown(toggle, { button: 0, clientX: 0, pointerId: 1 });
    fireEvent.pointerMove(toggle, { clientX: 12, pointerId: 1 });
    fireEvent.pointerUp(toggle, { clientX: 12, pointerId: 1 });
    fireEvent.click(toggle);
    expect(onChange.mock.calls).toEqual([[true]]);
    expect(toggle.getAttribute('aria-checked')).toBe('true');
  });

  it('emits a selection haptic on change', async () => {
    const haptics = vi.fn();
    render(
      <ThemeProvider haptics={haptics} motion="reduced">
        <Toggle label="Wi-Fi" />
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByRole('switch'));
    expect(haptics).toHaveBeenCalledWith('selection');
  });

  it('uses Atlassian colors and sizes, and the brand color with appearance="brand"', async () => {
    const theme = createTheme({ brand: '#7C3AED' });
    const { rerender } = renderToggle(<Toggle label="A" />, { theme });
    const toggle = screen.getByRole('switch');
    expect(toggle.style.width).toBe('32px');
    expect(toggle.style.backgroundColor).toBe(
      rgb(theme.light.color['color.background.neutral.bold']),
    );
    // The pointer stays over the toggle after clicking, so it settles on the hovered green…
    await userEvent.click(toggle);
    await waitFor(() =>
      expect(toggle.style.backgroundColor).toBe(
        rgb(theme.light.color['color.background.success.bold.hovered']),
      ),
    );
    // …and returns to the base green when the pointer leaves.
    await userEvent.unhover(toggle);
    await waitFor(() =>
      expect(toggle.style.backgroundColor).toBe(
        rgb(theme.light.color['color.background.success.bold']),
      ),
    );

    rerender(
      <ThemeProvider theme={theme} motion="reduced">
        <Toggle label="A" appearance="brand" size="large" defaultChecked />
      </ThemeProvider>,
    );
    await frames();
    expect(toggle.style.width).toBe('40px');
    expect(toggle.style.backgroundColor).toBe(rgb('#7C3AED'));
  });

  it('applies theme defaults and token overrides, with instance tokens winning', () => {
    const theme = createTheme({
      components: {
        Toggle: { defaultProps: { size: 'large' }, tokens: { trackOff: '#123456', width: 48 } },
      },
    });
    renderToggle(<Toggle label="A" tokens={{ width: 52 }} />, { theme });
    const toggle = screen.getByRole('switch');
    expect(toggle.style.width).toBe('52px');
    expect(toggle.style.height).toBe('20px'); // large, from defaultProps
    expect(toggle.style.backgroundColor).toBe(rgb('#123456'));
  });

  it('jumps instantly with reduced motion and springs with full motion', async () => {
    const { unmount } = renderToggle(<Toggle label="A" />, { motion: 'reduced' });
    await userEvent.click(screen.getByRole('switch'));
    await frames();
    expect(thumb().style.transform).toContain('translateX(18px)');
    unmount();

    renderToggle(<Toggle label="A" />, { motion: 'full' });
    await act(() => userEvent.click(screen.getByRole('switch')));
    await frames();
    // Two frames into a spring the thumb is on its way, not at the end.
    expect(thumb().style.transform).toMatch(/translateX\((?!18px)[\d.]+px\)/);
    await waitFor(() => expect(thumb().style.transform).toContain('translateX(18px)'), {
      timeout: 2000,
    });
  });

  it('submits with a form when checked', async () => {
    const { container } = renderToggle(<Toggle label="A" name="wifi" value="yes" />);
    expect(container.querySelector('input[name="wifi"]')).toBeNull();
    await userEvent.click(screen.getByRole('switch'));
    expect(container.querySelector<HTMLInputElement>('input[name="wifi"]')?.value).toBe('yes');
  });

  it('works inside a controlled parent that updates on change', async () => {
    function Parent() {
      const [on, setOn] = useState(false);
      return (
        <>
          <Toggle label="A" isChecked={on} onChange={setOn} />
          <span data-testid="state">{String(on)}</span>
        </>
      );
    }
    renderToggle(<Parent />);
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByTestId('state').textContent).toBe('true');
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
  });
});
