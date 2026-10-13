import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { getAnimatedStyle } from 'react-native-reanimated';
import {
  Badge,
  Banner,
  EmptyState,
  Lozenge,
  ProgressBar,
  ProgressIndicator,
  SectionMessage,
  Skeleton,
  Spinner,
  Tag,
  ThemeProvider,
  createTheme,
} from '../../index.native';

const c = createTheme().light.color;
const ui = (children: React.ReactNode, motion: 'full' | 'reduced' = 'reduced') => (
  <ThemeProvider motion={motion}>{children}</ThemeProvider>
);
const flat = (id: string) =>
  StyleSheet.flatten(screen.getByTestId(id, { includeHiddenElements: true }).props.style);
const skeleton = () => screen.getByTestId('s', { includeHiddenElements: true });

describe('Feedback (native)', () => {
  it('Spinner is a labelled progressbar, or hidden', async () => {
    await render(
      ui(
        <>
          <Spinner size="small" />
          <Spinner label={false} testID="quiet" />
        </>,
      ),
    );
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeTruthy();
    expect(screen.getByTestId('quiet').props.accessible).toBe(false);
  });

  it('ProgressBar reports its value', async () => {
    await render(ui(<ProgressBar value={0.25} label="Upload" testID="p" />));
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 25 });
    await act(async () => {
      fireEvent(bar, 'layout', { nativeEvent: { layout: { width: 200, height: 6 } } });
    });
    await waitFor(() => expect(getAnimatedStyle(screen.getByTestId('p-bar')).width).toBe('25%'));
  });

  it('ProgressIndicator stretches the current dot and selects steps', async () => {
    const onSelect = jest.fn();
    await render(
      ui(<ProgressIndicator count={3} selectedIndex={1} onSelect={onSelect} testID="d" />),
    );
    await waitFor(() => expect(getAnimatedStyle(screen.getByTestId('d-dot-1')).width).toBe(20));
    await waitFor(() => expect(getAnimatedStyle(screen.getByTestId('d-dot-0')).width).toBe(8));
    await fireEvent.press(screen.getByRole('tab', { name: 'Step 3 of 3' }));
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('Lozenge and Badge color by appearance', async () => {
    await render(
      ui(
        <>
          <Lozenge appearance="inprogress" testID="l">
            In progress
          </Lozenge>
          <Badge appearance="primary" testID="b">
            {150}
          </Badge>
        </>,
      ),
    );
    expect(flat('l').backgroundColor).toBe(c['color.background.information']);
    expect(flat('b').backgroundColor).toBe(c['color.background.brand.bold']);
    expect(screen.getByText('99+')).toBeTruthy();
  });

  it('Tag removes itself and reports it', async () => {
    const onRemove = jest.fn();
    await render(ui(<Tag text="Bug" color="red" isRemovable onRemove={onRemove} testID="t" />));
    expect(flat('t').backgroundColor).toBe(c['color.background.accent.red.subtler']);
    await fireEvent.press(screen.getByRole('button', { name: 'Remove Bug' }));
    expect(screen.queryByText('Bug')).toBeNull();
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('Banner is an alert and hides when closed', async () => {
    const { rerender } = await render(ui(<Banner appearance="error">Down</Banner>));
    expect(screen.getByRole('alert')).toBeTruthy();
    await rerender(
      ui(
        <Banner appearance="error" isOpen={false}>
          Down
        </Banner>,
      ),
    );
    expect(screen.queryByText('Down')).toBeNull();
  });

  it('SectionMessage shows title, body and actions', async () => {
    const onPress = jest.fn();
    await render(
      ui(
        <SectionMessage
          appearance="success"
          title="Saved"
          actions={[{ content: 'View', onPress }]}
          testID="m"
        >
          All changes are live.
        </SectionMessage>,
      ),
    );
    expect(flat('m').backgroundColor).toBe(c['color.background.success']);
    expect(screen.getByRole('header', { name: 'Saved' })).toBeTruthy();
    expect(screen.getByText('All changes are live.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'View' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('EmptyState shows its header and description', async () => {
    await render(ui(<EmptyState header="Nothing here" description="Add something" />));
    expect(screen.getByRole('header', { name: 'Nothing here' })).toBeTruthy();
    expect(screen.getByText('Add something')).toBeTruthy();
  });
});

describe('Skeleton (native)', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['queueMicrotask', 'nextTick'] });
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('pulses with full motion and stays still when reduced', async () => {
    const { rerender } = await render(ui(<Skeleton width={80} testID="s" />, 'full'));
    expect(flat('s')).toMatchObject({ width: 80, height: 16 });
    const start = getAnimatedStyle(skeleton()).backgroundColor;
    await act(async () => {
      for (let t = 0; t < 400; t += 16) jest.advanceTimersByTime(16);
    });
    expect(getAnimatedStyle(skeleton()).backgroundColor).not.toBe(start);
    await rerender(ui(<Skeleton width={80} testID="s" />));
    await act(async () => {
      jest.advanceTimersByTime(16);
    });
    const still = getAnimatedStyle(skeleton()).backgroundColor;
    await act(async () => {
      for (let t = 0; t < 400; t += 16) jest.advanceTimersByTime(16);
    });
    expect(getAnimatedStyle(skeleton()).backgroundColor).toBe(still);
  });
});
