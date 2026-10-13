import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field, Range, Select, TextArea } from '../../index.web';
import { renderThemed, rgb, theme } from '../internal/testUtils.web';

afterEach(cleanup);

const options = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team', isDisabled: true },
  { value: 'ent', label: 'Enterprise' },
];

describe('Select (web)', () => {
  it('opens a listbox, selects an option and shows it', async () => {
    const onChange = vi.fn();
    renderThemed(<Select label="Plan" options={options} onChange={onChange} testID="s" />);
    const trigger = screen.getByRole('button', { name: /Plan/ });
    expect(trigger.textContent).toContain('Select…');
    await userEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    await userEvent.click(screen.getByRole('option', { name: 'Pro' }));
    expect(onChange).toHaveBeenCalledWith('pro');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(trigger.textContent).toContain('Pro');
  });

  it('works from the keyboard, with typeahead and the selected option marked', async () => {
    const onChange = vi.fn();
    renderThemed(<Select label="Plan" options={options} defaultValue="pro" onChange={onChange} />);
    screen.getByRole('button', { name: /Plan/ }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Pro' }).getAttribute('aria-selected')).toBe('true');
    await userEvent.keyboard('e');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('ent');
  });

  it('follows the parent when controlled and shows validation', async () => {
    function Controlled() {
      const [v, setV] = useState<string | null>(null);
      return (
        <Select
          label="Plan"
          options={options}
          value={v}
          onChange={setV}
          isInvalid={!v}
          errorMessage="Pick a plan"
          name="plan"
        />
      );
    }
    renderThemed(
      <form data-testid="f">
        <Controlled />
      </form>,
    );
    expect(screen.getByText('Pick a plan')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /Plan/ }));
    await userEvent.click(screen.getByRole('option', { name: 'Free' }));
    await waitFor(() => expect(screen.queryByText('Pick a plan')).toBeNull());
    expect(new FormData(screen.getByTestId<HTMLFormElement>('f')).get('plan')).toBe('free');
  });

  it('does nothing while disabled', async () => {
    renderThemed(<Select label="Plan" options={options} isDisabled />);
    await userEvent.click(screen.getByRole('button', { name: /Plan/ }));
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('TextArea (web)', () => {
  it('is a labelled, multi-line field that reports changes', async () => {
    const onChange = vi.fn();
    renderThemed(<TextArea label="Notes" onChange={onChange} minimumRows={4} />);
    const ta = screen.getByRole('textbox', { name: 'Notes' }) as HTMLTextAreaElement;
    expect(ta.tagName).toBe('TEXTAREA');
    await userEvent.type(ta, 'Hi{Enter}there');
    expect(onChange).toHaveBeenLastCalledWith('Hi\nthere');
    expect(parseFloat(ta.style.minHeight)).toBeGreaterThan(80);
  });

  it('counts down remaining characters and stops at the limit', async () => {
    renderThemed(<TextArea label="Bio" maxCharacters={5} />);
    const ta = screen.getByRole('textbox', { name: 'Bio' }) as HTMLTextAreaElement;
    expect(screen.getByText('5 characters remaining')).toBeTruthy();
    await userEvent.type(ta, 'abcd');
    expect(screen.getByText('1 character remaining')).toBeTruthy();
    expect(ta.maxLength).toBe(5);
  });

  it('shows the error message and red border when invalid', () => {
    renderThemed(
      <TextArea label="Notes" isInvalid errorMessage="Required" helperMessage="Optional" />,
    );
    const ta = screen.getByRole('textbox', { name: 'Notes' });
    expect(screen.getByText('Required')).toBeTruthy();
    expect(screen.queryByText('Optional')).toBeNull();
    expect(ta.getAttribute('aria-invalid')).toBe('true');
    expect(ta.style.borderColor).toBe(rgb(theme.color['color.border.danger']));
  });
});

describe('Range (web)', () => {
  it('exposes slider semantics and moves with the keyboard', async () => {
    const onChange = vi.fn();
    renderThemed(
      <Range
        label="Volume"
        defaultValue={50}
        step={5}
        onChange={onChange}
        formatValue={(v) => `${v}%`}
      />,
    );
    const s = screen.getByRole('slider', { name: 'Volume' });
    expect(s.getAttribute('aria-valuenow')).toBe('50');
    expect(s.getAttribute('aria-valuetext')).toBe('50%');
    s.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(55);
    await userEvent.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith(100);
    await userEvent.keyboard('{PageDown}');
    expect(onChange).toHaveBeenLastCalledWith(90);
    await userEvent.keyboard('{Home}');
    expect(s.getAttribute('aria-valuenow')).toBe('0');
  });

  it('jumps to a click on the track and snaps to the step', () => {
    const onChange = vi.fn();
    renderThemed(<Range label="Size" min={0} max={10} step={2} onChange={onChange} testID="r" />);
    const track = screen.getByTestId('r').firstElementChild as HTMLElement;
    track.getBoundingClientRect = () => ({
      left: 0,
      width: 100,
      top: 0,
      height: 4,
      right: 100,
      bottom: 4,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.pointerDown(screen.getByTestId('r'), { button: 0, clientX: 37 });
    expect(onChange).toHaveBeenLastCalledWith(4);
  });

  it('ignores input when disabled', async () => {
    const onChange = vi.fn();
    renderThemed(<Range label="Volume" isDisabled onChange={onChange} />);
    const s = screen.getByRole('slider', { name: 'Volume' });
    expect(s.getAttribute('aria-disabled')).toBe('true');
    s.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Field (web)', () => {
  it('labels any control and links its message', () => {
    renderThemed(
      <Field label="Website" isRequired isInvalid errorMessage="Enter a URL">
        {(f) => (
          <input
            {...{
              id: f.id,
              'aria-describedby': f['aria-describedby'],
              'aria-invalid': f['aria-invalid'],
            }}
          />
        )}
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: /Website/ });
    const describedBy = input.getAttribute('aria-describedby')!;
    expect(document.getElementById(describedBy)!.textContent).toContain('Enter a URL');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('*')).toBeTruthy();
  });
});
