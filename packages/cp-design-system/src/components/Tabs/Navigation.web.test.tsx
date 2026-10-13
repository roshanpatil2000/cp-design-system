import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Breadcrumbs, Pagination, Tabs } from '../../index.web';
import { pageItems } from '../Pagination/Pagination.types';
import { renderThemed } from '../internal/testUtils.web';

afterEach(cleanup);

const tabs = [
  { id: 'overview', label: 'Overview', content: 'Overview panel' },
  { id: 'activity', label: 'Activity', content: 'Activity panel' },
  { id: 'locked', label: 'Locked', content: 'Locked panel', isDisabled: true },
  { id: 'settings', label: 'Settings', content: 'Settings panel' },
];

describe('Tabs (web)', () => {
  it('links tabs and panels and switches on click', async () => {
    const onChange = vi.fn();
    renderThemed(<Tabs tabs={tabs} label="Project" onChange={onChange} />);
    expect(screen.getByRole('tablist', { name: 'Project' })).toBeTruthy();
    const overview = screen.getByRole('tab', { name: 'Overview' });
    expect(overview.getAttribute('aria-selected')).toBe('true');
    const panel = screen.getByRole('tabpanel');
    expect(panel.getAttribute('aria-labelledby')).toBe(overview.id);
    await userEvent.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(onChange).toHaveBeenCalledWith('activity');
    await waitFor(() => expect(screen.getByRole('tabpanel').textContent).toBe('Activity panel'));
  });

  it('moves with arrow keys, skipping disabled tabs, with roving focus', async () => {
    renderThemed(<Tabs tabs={tabs} defaultSelected="activity" />);
    const activity = screen.getByRole('tab', { name: 'Activity' });
    expect(activity.tabIndex).toBe(0);
    expect(screen.getByRole('tab', { name: 'Overview' }).tabIndex).toBe(-1);
    activity.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Settings' }));
    expect(screen.getByRole('tab', { name: 'Settings' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' }).getAttribute('aria-selected')).toBe(
      'true',
    );
  });

  it('follows the parent when controlled', async () => {
    const onChange = vi.fn();
    renderThemed(<Tabs tabs={tabs} selected="overview" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(onChange).toHaveBeenCalledWith('activity');
    expect(screen.getByRole('tab', { name: 'Overview' }).getAttribute('aria-selected')).toBe(
      'true',
    );
  });
});

describe('Breadcrumbs (web)', () => {
  const items = ['Home', 'Projects', 'Design system', 'Components', 'Tabs'].map((label) => ({
    label,
    href: `#${label}`,
  }));

  it('renders a navigation list with the last item as the current page', () => {
    renderThemed(<Breadcrumbs items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumbs' })).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByRole('link', { name: 'Tabs' }).getAttribute('aria-current')).toBe('page');
  });

  it('collapses long trails and expands on click', async () => {
    renderThemed(<Breadcrumbs items={items} maxItems={3} />);
    expect(screen.queryByRole('link', { name: 'Projects' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Show more breadcrumbs' }));
    expect(screen.getByRole('link', { name: 'Projects' })).toBeTruthy();
  });
});

describe('Pagination (web)', () => {
  it('computes page windows with ellipses', () => {
    expect(pageItems(5, 0)).toEqual([0, 1, 2, 3, 4]);
    expect(pageItems(20, 0)).toEqual([0, 1, 2, 3, 4, '…', 19]);
    expect(pageItems(20, 10)).toEqual([0, '…', 9, 10, 11, '…', 19]);
    expect(pageItems(20, 19)).toEqual([0, '…', 15, 16, 17, 18, 19]);
  });

  it('marks the current page and navigates', async () => {
    const onChange = vi.fn();
    renderThemed(<Pagination pages={10} onChange={onChange} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Page 1' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect((screen.getByRole('button', { name: 'Previous' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole('button', { name: 'Page 2' }).getAttribute('aria-current')).toBe(
      'page',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Page 10' }));
    expect(onChange).toHaveBeenLastCalledWith(9);
    expect((screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement).disabled).toBe(true);
  });
});
