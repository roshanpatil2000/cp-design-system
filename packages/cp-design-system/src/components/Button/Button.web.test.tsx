import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, ThemeProvider, createTheme, type ThemePair } from '../../index.web';

afterEach(cleanup);

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

/** Motion writes styles on the next animation frame. */
const frames = () =>
  act(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
  );

function renderButton(
  ui: React.ReactElement,
  options: { theme?: ThemePair; motion?: 'full' | 'reduced'; haptics?: () => void } = {},
) {
  return render(
    <ThemeProvider
      theme={options.theme}
      motion={options.motion ?? 'reduced'}
      haptics={options.haptics}
    >
      {ui}
    </ThemeProvider>,
  );
}

const light = createTheme().light;

describe('Button (web)', () => {
  it('renders a native button with its label', () => {
    renderButton(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.getAttribute('type')).toBe('button');
  });

  it('calls onPress on click, Enter and Space', async () => {
    const onPress = vi.fn();
    renderButton(<Button onPress={onPress}>Save</Button>);
    await userEvent.click(screen.getByRole('button')); // also focuses it
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it('does nothing while disabled', async () => {
    const onPress = vi.fn();
    renderButton(
      <Button onPress={onPress} isDisabled>
        Save
      </Button>,
    );
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    await userEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button.style.color).toBe(rgb(light.color['color.text.disabled']));
  });

  it('shows a spinner while loading, stays focusable, and ignores presses', async () => {
    const onPress = vi.fn();
    renderButton(
      <Button onPress={onPress} isLoading>
        Save
      </Button>,
    );
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(false); // focus isn't lost mid-action
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(document.querySelector('[data-part="spinner"]')).not.toBeNull();
    // The label stays in the layout (invisible) so the width doesn't change.
    expect(screen.getByText('Save')).toBeTruthy();
    await userEvent.click(button);
    act(() => button.focus());
    expect(document.activeElement).toBe(button);
    await userEvent.keyboard('{Enter}');
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes isSelected as aria-pressed with the selected colors', () => {
    renderButton(<Button isSelected>Bold</Button>);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.style.backgroundColor).toBe(rgb(light.color['color.background.selected']));
    expect(button.style.color).toBe(rgb(light.color['color.text.selected']));
  });

  it("uses Atlassian's colors for each appearance", async () => {
    const { rerender } = renderButton(<Button appearance="primary">A</Button>);
    const button = screen.getByRole('button');
    const check = (bg: string, text: string, bordered: boolean) => {
      expect(button.style.backgroundColor).toBe(rgb(bg));
      expect(button.style.color).toBe(rgb(text));
      expect(button.style.boxShadow.includes('inset')).toBe(bordered);
    };
    const c = light.color;
    check(c['color.background.brand.bold'], c['color.text.onBrand'], false);
    for (const [appearance, bg, text] of [
      ['danger', c['color.background.danger.bold'], c['color.text.inverse']],
      ['warning', c['color.background.warning.bold'], c['color.text.warning.inverse']],
      ['discovery', c['color.background.discovery.bold'], c['color.text.inverse']],
    ] as const) {
      rerender(
        <ThemeProvider motion="reduced">
          <Button appearance={appearance}>A</Button>
        </ThemeProvider>,
      );
      await frames();
      check(bg, text, false);
    }
    rerender(
      <ThemeProvider motion="reduced">
        <Button>A</Button>
      </ThemeProvider>,
    );
    expect(button.style.boxShadow).toContain('inset'); // default has a 1px border
    rerender(
      <ThemeProvider motion="reduced">
        <Button appearance="subtle">A</Button>
      </ThemeProvider>,
    );
    expect(button.style.boxShadow).toBe('none');
  });

  it('is 32px tall by default and 24px when compact', () => {
    const { rerender } = renderButton(<Button>A</Button>);
    expect(screen.getByRole('button').style.height).toBe('32px');
    expect(screen.getByRole('button').style.borderRadius).toBe('6px');
    rerender(
      <ThemeProvider motion="reduced">
        <Button spacing="compact">A</Button>
      </ThemeProvider>,
    );
    expect(screen.getByRole('button').style.height).toBe('24px');
    expect(screen.getByRole('button').style.borderRadius).toBe('4px');
  });

  it('changes color on hover and press, and scales down only with motion on', async () => {
    const { unmount } = renderButton(<Button appearance="primary">A</Button>, { motion: 'full' });
    const button = screen.getByRole('button');
    fireEvent.pointerEnter(button);
    await waitFor(() =>
      expect(button.style.backgroundColor).toBe(
        rgb(light.color['color.background.brand.bold.hovered']),
      ),
    );
    fireEvent.pointerDown(button, { button: 0 });
    await waitFor(() =>
      expect(button.style.backgroundColor).toBe(
        rgb(light.color['color.background.brand.bold.pressed']),
      ),
    );
    await waitFor(() => expect(button.style.transform).toMatch(/scale\(0\.9/));
    fireEvent.pointerUp(button);
    await waitFor(() => expect(button.style.transform).toMatch(/none|scale\(1\)/));
    unmount();

    renderButton(<Button appearance="primary">B</Button>, { motion: 'reduced' });
    const reduced = screen.getByRole('button');
    fireEvent.pointerDown(reduced, { button: 0 });
    await frames();
    expect(reduced.style.backgroundColor).toBe(
      rgb(light.color['color.background.brand.bold.pressed']),
    );
    expect(reduced.style.transform).not.toMatch(/scale\(0\.9/);
  });

  it('emits an impactLight haptic on press', async () => {
    const haptics = vi.fn();
    renderButton(<Button>A</Button>, { haptics });
    await userEvent.click(screen.getByRole('button'));
    expect(haptics).toHaveBeenCalledWith('impactLight');
  });

  it('passes the current color and size to icon functions', () => {
    const icon = vi.fn(({ color, size }: { color: string; size: number }) => (
      <i data-testid="icon" data-color={color} data-size={size} />
    ));
    const { rerender } = renderButton(
      <Button appearance="primary" iconBefore={icon}>
        A
      </Button>,
    );
    expect(screen.getByTestId('icon').dataset).toMatchObject({
      color: light.color['color.text.onBrand'],
      size: '16',
    });
    rerender(
      <ThemeProvider motion="reduced">
        <Button appearance="primary" spacing="compact" iconAfter={icon} isDisabled>
          A
        </Button>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('icon').dataset).toMatchObject({
      color: light.color['color.text.disabled'],
      size: '12',
    });
  });

  it('stretches with shouldFitContainer', () => {
    renderButton(<Button shouldFitContainer>A</Button>);
    expect(screen.getByRole('button').style.width).toBe('100%');
  });

  it('follows the brand, with readable text on light brand colors', () => {
    const theme = createTheme({ brand: '#F5B800' });
    renderButton(<Button appearance="primary">A</Button>, { theme });
    const button = screen.getByRole('button');
    expect(button.style.backgroundColor).toBe(rgb('#F5B800'));
    expect(button.style.color).toBe(rgb(theme.light.color['color.text.onBrand']));
    expect(theme.light.color['color.text.onBrand']).not.toBe('#FFFFFF');
  });

  it('applies theme defaults and token overrides, with instance tokens winning', () => {
    const theme = createTheme({
      components: {
        Button: {
          defaultProps: { appearance: 'primary' },
          tokens: { radius: 999, paddingX: 20 },
        },
      },
    });
    renderButton(<Button tokens={{ paddingX: 28 }}>A</Button>, { theme });
    const button = screen.getByRole('button');
    expect(button.style.backgroundColor).toBe(
      rgb(theme.light.color['color.background.brand.bold']),
    );
    expect(button.style.borderRadius).toBe('999px');
    expect(button.style.padding).toBe('0px 28px');
  });

  it('can submit forms', () => {
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    renderButton(
      <form onSubmit={onSubmit as never}>
        <Button type="submit">Send</Button>
      </form>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalled();
  });
});
