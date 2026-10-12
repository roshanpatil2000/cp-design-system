import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Badge,
  Banner,
  Button,
  EmptyState,
  Lozenge,
  ProgressBar,
  ProgressIndicator,
  SectionMessage,
  Skeleton,
  Spinner,
  Tag,
  createTheme,
} from '../../index.web';
import { frames, renderThemed, rgb, theme } from '../internal/testUtils.web';

afterEach(cleanup);
const c = theme.color;

describe('Spinner (web)', () => {
  it('is labelled "Loading" by default, sized and colored', () => {
    renderThemed(<Spinner size="large" appearance="invert" testID="s" />);
    const s = screen.getByRole('img', { name: 'Loading' });
    expect(s.style.width).toBe('48px');
    expect(s.style.borderRightColor).toBe(rgb(c['color.icon.inverse']));
  });

  it('can be hidden when its parent already says it is busy', () => {
    renderThemed(<Spinner label={false} size={10} testID="s" />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByTestId('s').style.width).toBe('10px');
  });

  it("does not add 'Loading' to a loading button's name", () => {
    renderThemed(<Button isLoading>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
  });
});

describe('ProgressBar (web)', () => {
  it('exposes its value and scales the bar', async () => {
    const { rerender } = renderThemed(<ProgressBar value={0.4} label="Upload" testID="p" />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar.getAttribute('aria-valuenow')).toBe('0.4');
    await frames();
    const fill = bar.querySelector<HTMLElement>('[data-part="bar"]')!;
    expect(fill.style.transform).toContain('scaleX(0.4)');
    rerender(<ProgressBar value={7} label="Upload" />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('1');
  });

  it('drops the value when indeterminate and colors by appearance', () => {
    renderThemed(<ProgressBar isIndeterminate appearance="success" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBeNull();
    expect(bar.querySelector<HTMLElement>('[data-part="bar"]')!.style.background).toBe(
      rgb(c['color.background.success.bold']),
    );
  });
});

describe('ProgressIndicator (web)', () => {
  it('describes the current step and stretches its dot', async () => {
    renderThemed(<ProgressIndicator count={4} selectedIndex={1} />);
    expect(screen.getByRole('img', { name: 'Step 2 of 4' })).toBeTruthy();
    await frames();
    const dots = document.querySelectorAll<HTMLElement>('[data-part="dot"]');
    expect(dots[1]!.style.width).toBe('20px');
    expect(dots[0]!.style.width).toBe('8px');
  });

  it('becomes tabs that jump to a step when selectable', async () => {
    const onSelect = vi.fn();
    renderThemed(<ProgressIndicator count={3} selectedIndex={0} onSelect={onSelect} />);
    expect(screen.getByRole('tab', { name: 'Step 1 of 3' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    await userEvent.click(screen.getByRole('tab', { name: 'Step 3 of 3' }));
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});

describe('Lozenge (web)', () => {
  it('uses subtle and bold colors per appearance, uppercase', () => {
    renderThemed(
      <>
        <Lozenge testID="a" appearance="success">
          Done
        </Lozenge>
        <Lozenge testID="b" appearance="removed" isBold>
          Blocked
        </Lozenge>
      </>,
    );
    const a = screen.getByTestId('a');
    expect(a.style.background).toBe(rgb(c['color.background.success']));
    const text = a.firstElementChild as HTMLElement;
    expect(text.style.textTransform).toBe('uppercase');
    expect(text.style.color).toBe(rgb(c['color.text.success']));
    expect(screen.getByTestId('b').style.background).toBe(rgb(c['color.background.danger.bold']));
  });
});

describe('Badge (web)', () => {
  it('caps large numbers and marks additions', () => {
    renderThemed(
      <>
        <Badge>{5}</Badge>
        <Badge>{120}</Badge>
        <Badge max={500}>{120}</Badge>
        <Badge appearance="added">{3}</Badge>
        <Badge>New</Badge>
      </>,
    );
    for (const t of ['5', '99+', '120', '+3', 'New']) expect(screen.getByText(t)).toBeTruthy();
  });

  it('colors by appearance', () => {
    renderThemed(
      <Badge appearance="important" testID="b">
        {2}
      </Badge>,
    );
    expect(screen.getByTestId('b').style.background).toBe(rgb(c['color.background.danger.bold']));
  });
});

describe('Tag (web)', () => {
  it('uses accent colors and the rounded shape', () => {
    renderThemed(<Tag text="Design" color="purple" appearance="rounded" testID="t" />);
    const t = screen.getByTestId('t');
    expect(t.style.background).toBe(rgb(c['color.background.accent.purple.subtler']));
    expect(t.style.borderRadius).toBe('10px');
  });

  it('animates out and then reports removal', async () => {
    const onRemove = vi.fn();
    renderThemed(<Tag text="Design" isRemovable onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove Design' }));
    await waitFor(() => expect(screen.queryByText('Design')).toBeNull());
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

describe('Banner (web)', () => {
  it('announces warnings and errors with an icon', () => {
    renderThemed(<Banner appearance="error">Service is down</Banner>);
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Service is down');
    expect(alert.querySelector('[data-part="status-error"]')).toBeTruthy();
    expect(alert.style.background).toBe(rgb(c['color.background.danger.bold']));
  });

  it('collapses away when closed', async () => {
    const { rerender } = renderThemed(<Banner appearance="announcement">News</Banner>);
    expect(screen.getByRole('region', { name: 'Announcement' })).toBeTruthy();
    rerender(
      <Banner appearance="announcement" isOpen={false}>
        News
      </Banner>,
    );
    await waitFor(() => expect(screen.queryByText('News')).toBeNull());
  });
});

describe('SectionMessage (web)', () => {
  it('shows a title, body, icon and actions', async () => {
    const onPress = vi.fn();
    renderThemed(
      <SectionMessage
        appearance="warning"
        title="Check your settings"
        actions={[
          { content: 'Fix it', onPress },
          { content: 'Learn more', onPress: () => {} },
        ]}
        testID="m"
      >
        Two fields need attention.
      </SectionMessage>,
    );
    const m = screen.getByRole('region', { name: 'Check your settings' });
    expect(m.style.background).toBe(rgb(c['color.background.warning']));
    expect(m.querySelector('[data-part="status-warning"]')).toBeTruthy();
    expect(screen.getByText('·')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Fix it' }));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('Skeleton (web)', () => {
  it('is hidden, sized, and only pulses with full motion', () => {
    renderThemed(<Skeleton width={120} height={12} borderRadius="full" testID="a" />, {
      motion: 'full',
    });
    const a = screen.getByTestId('a');
    expect(a.getAttribute('aria-hidden')).toBe('true');
    expect([a.style.width, a.style.height, a.style.borderRadius]).toEqual([
      '120px',
      '12px',
      '9999px',
    ]);
    expect(a.getAttribute('data-shimmering')).toBe('true');
    cleanup();
    renderThemed(<Skeleton testID="b" />);
    expect(screen.getByTestId('b').getAttribute('data-shimmering')).toBeNull();
  });
});

describe('EmptyState (web)', () => {
  it('lays out header, description and actions', async () => {
    const onPress = vi.fn();
    renderThemed(
      <EmptyState
        header="No projects yet"
        description="Create one to get started."
        primaryAction={
          <Button appearance="primary" onPress={onPress}>
            Create project
          </Button>
        }
        isLoading
        width="narrow"
        testID="e"
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'No projects yet' })).toBeTruthy();
    expect(screen.getByText('Create one to get started.')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Loading' })).toBeTruthy();
    expect(screen.getByTestId('e').style.maxWidth).toBe('304px');
    await userEvent.click(screen.getByRole('button', { name: 'Create project' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('takes default props from the theme', () => {
    const t = createTheme({ components: { EmptyState: { defaultProps: { width: 'narrow' } } } });
    renderThemed(<EmptyState header="Empty" testID="e" />, { theme: t });
    expect(screen.getByTestId('e').style.maxWidth).toBe('304px');
  });
});
