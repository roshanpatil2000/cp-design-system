import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { getAnimatedStyle } from 'react-native-reanimated';
import { Modal, ThemeProvider, type ModalProps } from '../../index.native';

async function setup(props: Partial<ModalProps> = {}, motion: 'full' | 'reduced' = 'reduced') {
  const onClose = jest.fn();
  const ui = (p: Partial<ModalProps>) => (
    <ThemeProvider motion={motion}>
      <Modal
        isOpen
        title="Delete project"
        onClose={onClose}
        testID="m"
        footer={<Text>Footer</Text>}
        {...props}
        {...p}
      >
        This can&apos;t be undone.
      </Modal>
    </ThemeProvider>
  );
  const utils = await render(ui({}));
  return { onClose, rerender: (p: Partial<ModalProps>) => utils.rerender(ui(p)) };
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

describe('Modal (native)', () => {
  it('renders nothing while closed', async () => {
    await setup({ isOpen: false });
    expect(screen.queryByText('Delete project')).toBeNull();
  });

  it('renders the title as a header, the body text and the footer', async () => {
    await setup();
    expect(screen.getByRole('header', { name: 'Delete project' })).toBeTruthy();
    expect(screen.getByText("This can't be undone.")).toBeTruthy();
    expect(screen.getByText('Footer')).toBeTruthy();
    expect(screen.getByTestId('m').props.accessibilityViewIsModal).toBe(true);
  });

  it('closes on blanket press unless turned off', async () => {
    const { onClose, rerender } = await setup();
    await fireEvent.press(screen.getByTestId('m-blanket', { includeHiddenElements: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
    await rerender({ shouldCloseOnBlanketClick: false });
    await fireEvent.press(screen.getByTestId('m-blanket', { includeHiddenElements: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('animates in and out, unmounting after the exit', async () => {
    const onCloseComplete = jest.fn();
    const { rerender } = await setup({ isOpen: false, onCloseComplete }, 'full');
    await rerender({ isOpen: true, onCloseComplete });
    await advance(16);
    const opacity = () => getAnimatedStyle(screen.getByTestId('m')).opacity as number;
    expect(opacity()).toBeLessThan(1);
    await advance(400);
    expect(opacity()).toBe(1);
    await rerender({ isOpen: false, onCloseComplete });
    await advance(50);
    expect(screen.getByText('Delete project')).toBeTruthy();
    await advance(400);
    expect(screen.queryByText('Delete project')).toBeNull();
    expect(onCloseComplete).toHaveBeenCalledTimes(1);
  });

  it('closes at once with reduced motion', async () => {
    const onCloseComplete = jest.fn();
    const { rerender } = await setup({ onCloseComplete });
    await rerender({ isOpen: false, onCloseComplete });
    expect(screen.queryByText('Delete project')).toBeNull();
    expect(onCloseComplete).toHaveBeenCalledTimes(1);
  });
});
