import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FlagProvider,
  ThemeProvider,
  createTheme,
  getFlagTokens,
  useFlags,
  type FlagApi,
  type FlagProviderProps,
} from '../../index.web';

afterEach(cleanup);

function setup(props: Partial<FlagProviderProps> = {}) {
  let api!: FlagApi;
  function Grab() {
    api = useFlags();
    return null;
  }
  render(
    <ThemeProvider motion="reduced">
      <FlagProvider {...props}>
        <Grab />
      </FlagProvider>
    </ThemeProvider>,
  );
  return {
    show: (...args: Parameters<FlagApi['showFlag']>) => {
      let id = '';
      act(() => {
        id = api.showFlag(...args);
      });
      return id;
    },
    api: () => api,
  };
}

const region = () => screen.getByRole('region', { name: 'Notifications' });
const sleep = (ms: number) => act(() => new Promise<void>((r) => setTimeout(r, ms)));

describe('FlagProvider (web)', () => {
  it('shows a flag with title, description and actions in a labelled region', async () => {
    const { show } = setup();
    const onPress = vi.fn();
    show({
      title: 'Saved',
      description: 'Your changes are live.',
      appearance: 'success',
      actions: [{ content: 'Undo', onPress }],
    });
    const flag = screen.getByRole('status', { name: 'Saved' });
    expect(region().contains(flag)).toBe(true);
    expect(screen.getByText('Your changes are live.')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('announces errors and warnings as alerts', () => {
    const { show } = setup();
    show({ title: 'Failed', appearance: 'error' });
    show({ title: 'Careful', appearance: 'warning' });
    expect(screen.getByRole('alert', { name: 'Failed' })).toBeTruthy();
    expect(screen.getByRole('alert', { name: 'Careful' })).toBeTruthy();
  });

  it('dismisses with the close button and calls onDismissed', async () => {
    const { show } = setup();
    const onDismissed = vi.fn();
    const id = show({ title: 'Hello', onDismissed });
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(screen.queryByText('Hello')).toBeNull());
    expect(onDismissed).toHaveBeenCalledWith(id);
  });

  it('auto-dismisses after the duration, pausing while hovered', async () => {
    const { show } = setup({ autoDismissDuration: 120 });
    show({ title: 'Brief' });
    show({ title: 'Sticky', isAutoDismiss: false });
    const brief = screen.getByRole('status', { name: 'Brief' });
    await userEvent.hover(brief);
    await sleep(200);
    expect(screen.getByText('Brief')).toBeTruthy();
    await userEvent.unhover(brief);
    await waitFor(() => expect(screen.queryByText('Brief')).toBeNull());
    await sleep(200);
    expect(screen.getByText('Sticky')).toBeTruthy();
  });

  it('replaces a flag shown again with the same id, and dismisses by id or all at once', async () => {
    const { show, api } = setup();
    show({ id: 'sync', title: 'Syncing' });
    show({ id: 'sync', title: 'Synced' });
    expect(screen.queryByText('Syncing')).toBeNull();
    expect(screen.getByText('Synced')).toBeTruthy();
    show({ title: 'Other' });
    act(() => api().dismissFlag('sync'));
    await waitFor(() => expect(screen.queryByText('Synced')).toBeNull());
    act(() => api().dismissAllFlags());
    await waitFor(() => expect(screen.queryByText('Other')).toBeNull());
  });

  it('keeps at most maxFlags, dropping the oldest', async () => {
    const { show } = setup({ maxFlags: 2 });
    show({ title: 'One' });
    show({ title: 'Two' });
    show({ title: 'Three' });
    await waitFor(() => expect(screen.queryByText('One')).toBeNull());
    expect(screen.getByText('Two')).toBeTruthy();
    expect(screen.getByText('Three')).toBeTruthy();
  });

  it('colors each appearance from the theme, with overrides', () => {
    const theme = createTheme({ components: { Flag: { tokens: { radius: 2 } } } });
    let api!: FlagApi;
    function Grab() {
      api = useFlags();
      return null;
    }
    render(
      <ThemeProvider theme={theme} motion="reduced">
        <FlagProvider testID="f">
          <Grab />
        </FlagProvider>
      </ThemeProvider>,
    );
    act(() => {
      api.showFlag({ id: 'e', title: 'Error', appearance: 'error' });
    });
    const el = screen.getByTestId('f-e');
    const t = getFlagTokens(theme.light, 'error');
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(t.background.slice(i, i + 2), 16));
    expect(el.style.background).toBe(`rgb(${r}, ${g}, ${b})`);
    expect(el.style.borderRadius).toBe('2px');
    expect(el.getAttribute('data-appearance')).toBe('error');
  });

  it('throws a helpful error outside a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useFlags())).toThrow(/FlagProvider/);
  });
});
