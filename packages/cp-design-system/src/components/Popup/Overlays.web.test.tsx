import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Drawer, DropdownMenu, InlineDialog, Popup, Tooltip } from '../../index.web';
import { renderThemed } from '../internal/testUtils.web';

afterEach(cleanup);

function PopupDemo({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popup
      isOpen={open}
      onClose={() => {
        setOpen(false);
        onClose?.();
      }}
      label="Filters"
      trigger={<Button onPress={() => setOpen(!open)}>Filters</Button>}
      content={
        <div>
          <button>Apply</button>
        </div>
      }
    />
  );
}

describe('Popup (web)', () => {
  it('opens a labelled dialog and focuses its content', async () => {
    renderThemed(<PopupDemo />);
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Apply' })),
    );
  });

  it('closes on Escape (returning focus) and on outside clicks', async () => {
    const onClose = vi.fn();
    renderThemed(<PopupDemo onClose={onClose} />);
    const trigger = screen.getByRole('button', { name: 'Filters' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
    await userEvent.click(trigger);
    await userEvent.click(document.body);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

describe('InlineDialog (web)', () => {
  it('shows padded content next to its trigger', async () => {
    function Demo() {
      const [open, setOpen] = useState(true);
      return (
        <InlineDialog
          isOpen={open}
          onClose={() => setOpen(false)}
          content="Usernames must be unique."
          label="Help"
        >
          <button>?</button>
        </InlineDialog>
      );
    }
    renderThemed(<Demo />);
    const d = screen.getByRole('dialog', { name: 'Help' });
    expect(d.textContent).toBe('Usernames must be unique.');
    expect(d.style.padding).toBe('16px');
  });
});

describe('Tooltip (web)', () => {
  it('shows after hovering, describes the trigger, and hides on leave or Escape', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderThemed(
      <Tooltip content="Copy link" testID="tt">
        <button>Copy</button>
      </Tooltip>,
    );
    const btn = screen.getByRole('button', { name: 'Copy' });
    fireEvent.pointerEnter(screen.getByTestId('tt'));
    expect(screen.queryByRole('tooltip')).toBeNull();
    await act(async () => {
      vi.advanceTimersByTime(350);
    });
    const tip = screen.getByRole('tooltip');
    expect(tip.textContent).toBe('Copy link');
    expect(btn.getAttribute('aria-describedby')).toBe(tip.id);
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    vi.useRealTimers();
  });

  it('shows immediately on keyboard focus and describes our Button', async () => {
    renderThemed(
      <Tooltip content="Save draft">
        <Button>Save</Button>
      </Tooltip>,
    );
    await userEvent.tab();
    const tip = await screen.findByRole('tooltip');
    expect(screen.getByRole('button', { name: 'Save' }).getAttribute('aria-describedby')).toBe(
      tip.id,
    );
    await userEvent.tab();
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  });
});

describe('DropdownMenu (web)', () => {
  it('opens a menu with sections and runs actions', async () => {
    const edit = vi.fn();
    renderThemed(
      <DropdownMenu
        trigger="Actions"
        items={[
          { label: 'Edit', onPress: edit, icon: 'add', group: 'Issue' },
          { label: 'Move', description: 'To another project', group: 'Issue' },
          { label: 'Delete', isDisabled: true, group: 'Danger' },
        ]}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    await userEvent.click(trigger);
    expect(screen.getByText('Issue')).toBeTruthy();
    expect(screen.getByText('Danger')).toBeTruthy();
    expect(screen.getByText('To another project')).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /Delete/ }).getAttribute('aria-disabled')).toBe(
      'true',
    );
    await userEvent.click(screen.getByRole('menuitem', { name: /Edit/ }));
    expect(edit).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('keeps open for checkbox items and supports icon triggers', async () => {
    function Demo() {
      const [compact, setCompact] = useState(false);
      return (
        <DropdownMenu
          trigger={{ icon: 'chevron-down', label: 'View options' }}
          items={[{ label: 'Compact', isChecked: compact, onCheckedChange: setCompact }]}
        />
      );
    }
    renderThemed(<Demo />);
    await userEvent.click(screen.getByRole('button', { name: 'View options' }));
    const item = screen.getByRole('menuitemcheckbox', { name: /Compact/ });
    expect(item.getAttribute('aria-checked')).toBe('false');
    await userEvent.click(item);
    expect(
      screen.getByRole('menuitemcheckbox', { name: /Compact/ }).getAttribute('aria-checked'),
    ).toBe('true');
  });
});

describe('Drawer (web)', () => {
  it('opens a labelled dialog, closes from the button and Escape, restores focus', async () => {
    const onCloseComplete = vi.fn();
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open drawer</button>
          <Drawer
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Settings"
            onCloseComplete={onCloseComplete}
          >
            <input aria-label="Name" />
          </Drawer>
        </>
      );
    }
    renderThemed(<Demo />);
    const opener = screen.getByRole('button', { name: 'Open drawer' });
    await userEvent.click(opener);
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onCloseComplete).toHaveBeenCalled();
    expect(document.activeElement).toBe(opener);
    await userEvent.click(opener);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('keeps focus on the trigger when closed before it focuses its content', async () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open drawer</button>
          <Drawer isOpen={open} onClose={() => setOpen(false)} title="Settings">
            <input aria-label="Name" />
          </Drawer>
        </>
      );
    }
    // Full motion keeps the panel mounted while it slides out.
    renderThemed(<Demo />, { motion: 'full' });
    const opener = screen.getByRole('button', { name: 'Open drawer' });
    opener.focus();
    // Open and close within one frame, before the drawer moves focus inside.
    fireEvent.click(opener);
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(opener);
  });

  it('slides from the chosen side with the chosen width', () => {
    renderThemed(
      <Drawer isOpen onClose={() => {}} label="Panel" placement="right" width="wide" testID="d">
        Content
      </Drawer>,
    );
    const d = screen.getByTestId('d');
    expect(d.style.right).toBe('0px');
    expect(d.style.width).toBe('600px');
  });
});
