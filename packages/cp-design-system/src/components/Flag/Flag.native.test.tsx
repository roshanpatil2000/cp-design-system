import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';
import {
  FlagProvider,
  ThemeProvider,
  useFlags,
  type FlagApi,
  type FlagProviderProps,
} from '../../index.native';

async function setup(
  props: Partial<FlagProviderProps> = {},
  motion: 'full' | 'reduced' = 'reduced',
) {
  let api!: FlagApi;
  function Grab() {
    api = useFlags();
    return <Text>App</Text>;
  }
  await render(
    <ThemeProvider motion={motion}>
      <FlagProvider {...props}>
        <Grab />
      </FlagProvider>
    </ThemeProvider>,
  );
  return {
    show: async (...args: Parameters<FlagApi['showFlag']>) => {
      let id = '';
      await act(async () => {
        id = api.showFlag(...args);
      });
      return id;
    },
    api: () => api,
  };
}

beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ['queueMicrotask', 'nextTick'] });
});
afterEach(() => {
  jest.useRealTimers();
});

const advance = (ms: number) =>
  act(async () => {
    for (let t = 0; t < ms; t += 16) jest.advanceTimersByTime(16);
  });

describe('FlagProvider (native)', () => {
  it('renders children and shows flags over them', async () => {
    const { show } = await setup();
    expect(screen.getByText('App')).toBeTruthy();
    const onPress = jest.fn();
    await show({
      id: 'a',
      title: 'Saved',
      description: 'All good',
      appearance: 'success',
      actions: [{ content: 'Undo', onPress }],
    });
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('All good')).toBeTruthy();
    expect(screen.getByTestId('flag-a').props.accessibilityLiveRegion).toBe('polite');
    await fireEvent.press(screen.getByRole('button', { name: 'Undo' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('announces errors assertively', async () => {
    const { show } = await setup();
    await show({ id: 'e', title: 'Failed', appearance: 'error' });
    const flag = screen.getByTestId('flag-e');
    expect(flag.props.accessibilityRole).toBe('alert');
    expect(flag.props.accessibilityLiveRegion).toBe('assertive');
  });

  it('dismisses with the close button', async () => {
    const { show } = await setup();
    const onDismissed = jest.fn();
    await show({ id: 'a', title: 'Hello', onDismissed });
    await fireEvent.press(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Hello')).toBeNull();
    expect(onDismissed).toHaveBeenCalledWith('a');
  });

  it('auto-dismisses after 8 seconds unless turned off', async () => {
    const { show } = await setup();
    await show({ title: 'Brief' });
    await show({ title: 'Sticky', isAutoDismiss: false });
    await advance(7900);
    expect(screen.getByText('Brief')).toBeTruthy();
    await advance(200);
    expect(screen.queryByText('Brief')).toBeNull();
    expect(screen.getByText('Sticky')).toBeTruthy();
  });

  it('pauses the countdown while touched', async () => {
    const { show } = await setup({ autoDismissDuration: 1000 }, 'full');
    await show({ id: 'p', title: 'Hold me' });
    fireGestureHandler(getByGestureTestId('flag-p-pan'), [{ state: State.BEGAN }]);
    await advance(2000);
    expect(screen.getByText('Hold me')).toBeTruthy();
    fireGestureHandler(getByGestureTestId('flag-p-pan'), [
      { state: State.BEGAN },
      { state: State.FAILED },
    ]);
    await advance(1500);
    expect(screen.queryByText('Hold me')).toBeNull();
  });

  it('dismisses on a swipe, and springs back from a short drag', async () => {
    const { show } = await setup({}, 'full');
    const onDismissed = jest.fn();
    await show({ id: 's', title: 'Swipe me', onDismissed, isAutoDismiss: false });
    const pan = (translationX: number) =>
      act(async () =>
        fireGestureHandler(getByGestureTestId('flag-s-pan'), [
          { state: State.BEGAN, translationX: 0 },
          { state: State.ACTIVE, translationX },
          { state: State.END, translationX },
        ]),
      );
    await pan(40);
    await advance(600);
    expect(screen.getByText('Swipe me')).toBeTruthy();
    expect(onDismissed).not.toHaveBeenCalled();
    await pan(160);
    await advance(600);
    expect(screen.queryByText('Swipe me')).toBeNull();
    expect(onDismissed).toHaveBeenCalledWith('s');
  });

  it('replaces flags by id and limits how many are visible', async () => {
    const { show, api } = await setup({ maxFlags: 2 });
    await show({ id: 'x', title: 'Syncing' });
    await show({ id: 'x', title: 'Synced' });
    expect(screen.queryByText('Syncing')).toBeNull();
    await show({ title: 'Two' });
    await show({ title: 'Three' });
    expect(screen.queryByText('Synced')).toBeNull();
    await act(async () => api().dismissAllFlags());
    expect(screen.queryByText('Two')).toBeNull();
    expect(screen.queryByText('Three')).toBeNull();
  });
});
