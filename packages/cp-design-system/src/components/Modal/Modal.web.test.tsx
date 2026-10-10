import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Modal, ThemeProvider, type ModalProps } from '../../index.web';

afterEach(cleanup);

function setup(props: Partial<ModalProps> = {}) {
  const onClose = vi.fn();
  const ui = (p: Partial<ModalProps>) => (
    <ThemeProvider motion="reduced">
      <button>Opener</button>
      <Modal
        isOpen
        title="Delete project"
        onClose={onClose}
        testID="m"
        footer={
          <>
            <Button onPress={onClose}>Cancel</Button>
            <Button appearance="danger">Delete</Button>
          </>
        }
        {...props}
        {...p}
      >
        This can't be undone.
      </Modal>
    </ThemeProvider>
  );
  const utils = render(ui({}));
  return { onClose, rerender: (p: Partial<ModalProps>) => utils.rerender(ui(p)) };
}

const dialog = () => screen.getByRole('dialog', { name: 'Delete project' });

describe('Modal (web)', () => {
  it('renders nothing while closed', () => {
    setup({ isOpen: false });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders a labelled modal dialog in a portal', () => {
    setup();
    expect(dialog().getAttribute('aria-modal')).toBe('true');
    expect(dialog().parentElement!.parentElement).toBe(document.body);
    expect(screen.getByRole('heading', { name: 'Delete project' })).toBeTruthy();
    expect(screen.getByText("This can't be undone.")).toBeTruthy();
  });

  it('focuses the first control and keeps Tab inside the dialog', async () => {
    setup();
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const del = screen.getByRole('button', { name: 'Delete' });
    expect(document.activeElement).toBe(cancel);
    await userEvent.tab();
    expect(document.activeElement).toBe(del);
    await userEvent.tab();
    expect(document.activeElement).toBe(cancel);
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(del);
  });

  it('closes on Escape and blanket click unless turned off', async () => {
    const { onClose, rerender } = setup();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    await userEvent.click(document.querySelector('[data-part="blanket"]')!);
    expect(onClose).toHaveBeenCalledTimes(2);
    rerender({ shouldCloseOnEscapePress: false, shouldCloseOnBlanketClick: false });
    await userEvent.keyboard('{Escape}');
    await userEvent.click(document.querySelector('[data-part="blanket"]')!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('unmounts after closing, restores focus and calls onCloseComplete', async () => {
    function Harness({ onCloseComplete }: { onCloseComplete: () => void }) {
      const [open, setOpen] = useState(false);
      return (
        <ThemeProvider motion="reduced">
          <button onClick={() => setOpen(true)}>Open</button>
          <Modal
            isOpen={open}
            title="Settings"
            onClose={() => setOpen(false)}
            onCloseComplete={onCloseComplete}
          >
            <input aria-label="Name" />
          </Modal>
        </ThemeProvider>
      );
    }
    const onCloseComplete = vi.fn();
    render(<Harness onCloseComplete={onCloseComplete} />);
    const open = screen.getByRole('button', { name: 'Open' });
    await userEvent.click(open);
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Name' }));
    expect(document.body.style.overflow).toBe('hidden');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onCloseComplete).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(open);
    expect(document.body.style.overflow).toBe('');
  });

  it('sizes from the width prop', async () => {
    const { rerender } = setup({ width: 'small' });
    expect(dialog().style.width).toBe('400px');
    rerender({ width: 'x-large' });
    expect(dialog().style.width).toBe('968px');
    rerender({ width: 520 });
    expect(dialog().style.width).toBe('520px');
    await act(async () => {});
  });

  it('shows a status icon for warning and danger appearances', () => {
    setup({ appearance: 'danger' });
    expect(document.querySelector('[data-part="status-error"]')).toBeTruthy();
  });
});
