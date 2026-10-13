import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton, LinkButton, SplitButton, createTheme } from '../../index.web';
import { renderThemed } from '../internal/testUtils.web';

afterEach(cleanup);

describe('IconButton (web)', () => {
  it('is a square, labelled button that draws its glyph', async () => {
    const onPress = vi.fn();
    renderThemed(<IconButton icon="add" label="Add item" onPress={onPress} testID="b" />);
    const b = screen.getByRole('button', { name: 'Add item' });
    expect(b.style.padding).toBe('0px 8px');
    expect(b.querySelector('[data-glyph="add"]')).toBeTruthy();
    await userEvent.click(b);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('supports compact, circle, custom icons and theme defaults', () => {
    const theme = createTheme({
      components: { IconButton: { defaultProps: { shape: 'circle' } } },
    });
    renderThemed(
      <IconButton
        icon={({ color, size }) => <span data-testid="custom" style={{ color, width: size }} />}
        label="Custom"
        spacing="compact"
      />,
      { theme },
    );
    const b = screen.getByRole('button', { name: 'Custom' });
    expect(b.style.borderRadius).toBe('9999px');
    expect(b.style.padding).toBe('0px 6px');
    expect(screen.getByTestId('custom').style.width).toBe('12px');
  });
});

describe('LinkButton (web)', () => {
  it('renders an anchor styled as a button', () => {
    renderThemed(
      <LinkButton href="https://example.com" target="_blank" appearance="primary">
        Docs
      </LinkButton>,
    );
    const a = screen.getByRole('link', { name: 'Docs' });
    expect(a.getAttribute('href')).toBe('https://example.com');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('drops the href when disabled', () => {
    renderThemed(
      <LinkButton href="/x" isDisabled>
        Gone
      </LinkButton>,
    );
    const a = screen.getByRole('link', { name: 'Gone' });
    expect(a.getAttribute('href')).toBeNull();
    expect(a.getAttribute('aria-disabled')).toBe('true');
  });
});

describe('SplitButton (web)', () => {
  function setup(disabledSecond = false) {
    const main = vi.fn();
    const dup = vi.fn();
    const archive = vi.fn();
    renderThemed(
      <SplitButton
        appearance="primary"
        onPress={main}
        items={[
          { label: 'Duplicate', onPress: dup },
          { label: 'Archive', onPress: archive, isDisabled: disabledSecond },
        ]}
        testID="s"
      >
        Publish
      </SplitButton>,
    );
    return { main, dup, archive };
  }

  it('runs the main action and opens a menu of the others', async () => {
    const { main, dup } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Publish' }));
    expect(main).toHaveBeenCalled();
    const trigger = screen.getByRole('button', { name: 'More actions' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menu', { name: 'More actions' })).toBeTruthy();
    await userEvent.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(dup).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('is keyboard driven and skips disabled items', async () => {
    const { dup, archive } = setup(true);
    screen.getByRole('button', { name: 'More actions' }).focus();
    await userEvent.keyboard('{Enter}');
    const menu = screen.getByRole('menu');
    expect(document.activeElement).toBe(menu);
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(archive).not.toHaveBeenCalled();
    expect(dup).toHaveBeenCalled();
  });

  it('closes on Escape and outside clicks', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    await userEvent.click(document.body);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });
});
