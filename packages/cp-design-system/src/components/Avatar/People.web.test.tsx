import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Avatar, AvatarGroup } from '../../index.web';
import { initials } from './Avatar.types';
import { renderThemed } from '../internal/testUtils.web';

afterEach(cleanup);

describe('Avatar (web)', () => {
  it('shows initials with an accessible name and presence', () => {
    renderThemed(<Avatar name="Ada Lovelace" presence="online" size="large" testID="a" />);
    const a = screen.getByRole('img', { name: 'Ada Lovelace (online)' });
    expect(a.textContent).toBe('AL');
    expect(a.querySelector('[data-part="presence"]')).toBeTruthy();
    expect((a.firstElementChild as HTMLElement).style.width).toBe('40px');
  });

  it('keeps initials until the image loads, and falls back on error', () => {
    renderThemed(<Avatar name="Grace Hopper" src="https://example.com/g.png" />);
    const img = document.querySelector<HTMLImageElement>('[data-part="image"]')!;
    expect(screen.getByText('GH')).toBeTruthy();
    fireEvent.load(img);
    expect(screen.queryByText('GH')).toBeNull();
    cleanup();
    renderThemed(<Avatar name="Grace Hopper" src="https://example.com/broken.png" />);
    fireEvent.error(document.querySelector('[data-part="image"]')!);
    expect(document.querySelector('[data-part="image"]')).toBeNull();
    expect(screen.getByText('GH')).toBeTruthy();
  });

  it('becomes a button with onPress, and squares for projects', async () => {
    const onPress = vi.fn();
    renderThemed(<Avatar name="Design team" appearance="square" onPress={onPress} />);
    await userEvent.click(screen.getByRole('button', { name: 'Design team' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('derives initials sensibly', () => {
    expect(initials('ada')).toBe('A');
    expect(initials('  Ada  King  Lovelace ')).toBe('AL');
    expect(initials('')).toBe('?');
  });
});

describe('AvatarGroup (web)', () => {
  const people = ['Ada', 'Grace', 'Alan', 'Linus', 'Margaret', 'Dennis', 'Ken'].map((n) => ({
    name: n,
  }));

  it('shows up to maxCount, then a +N button that expands the group', async () => {
    renderThemed(<AvatarGroup data={people} maxCount={4} label="Team" />);
    expect(screen.getByRole('group', { name: 'Team' })).toBeTruthy();
    expect(screen.getAllByRole('img')).toHaveLength(3);
    await userEvent.click(screen.getByRole('button', { name: 'Show 4 more' }));
    expect(screen.getAllByRole('img')).toHaveLength(7);
    expect(screen.queryByRole('button', { name: /more/ })).toBeNull();
  });

  it('calls onMorePress instead when given', async () => {
    const onMore = vi.fn();
    renderThemed(<AvatarGroup data={people} onMorePress={onMore} />);
    await userEvent.click(screen.getByRole('button', { name: 'Show 3 more' }));
    expect(onMore).toHaveBeenCalled();
    expect(screen.getAllByRole('img')).toHaveLength(4);
  });
});
