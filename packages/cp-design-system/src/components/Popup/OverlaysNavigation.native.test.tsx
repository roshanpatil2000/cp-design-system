import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { createRef, useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';
import {
  Breadcrumbs,
  Button,
  Drawer,
  DropdownMenu,
  FlagProvider,
  InlineDialog,
  Modal,
  Pagination,
  Popup,
  Tabs,
  ThemeProvider,
  Tooltip,
  useFlags,
} from '../../index.native';

const ui = (children: React.ReactNode) => (
  <ThemeProvider motion="reduced">{children}</ThemeProvider>
);
const flush = () => act(async () => {});

// Jest's mocked View never answers measureInWindow, so anchored overlays would never open.
beforeAll(async () => {
  const ref = createRef<View>();
  await render(<View ref={ref} />);
  const proto = Object.getPrototypeOf(ref.current) as {
    measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => void;
  };
  proto.measureInWindow = (cb) => cb(16, 100, 240, 40);
});

describe('Popup and InlineDialog (native)', () => {
  it('Popup shows its content when open and closes from the backdrop', async () => {
    const onClose = jest.fn();
    await render(
      ui(
        <Popup
          isOpen
          onClose={onClose}
          label="Filters"
          trigger={<Text>Trigger</Text>}
          content={<Text>Panel</Text>}
          testID="p"
        />,
      ),
    );
    expect(screen.getByText('Trigger')).toBeTruthy();
    expect(screen.getByText('Panel')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('p-backdrop', { includeHiddenElements: true }));
    expect(onClose).toHaveBeenCalled();
  });

  it('InlineDialog wraps plain text content', async () => {
    await render(
      ui(
        <InlineDialog isOpen onClose={() => {}} content="Must be unique.">
          <Text>?</Text>
        </InlineDialog>,
      ),
    );
    expect(screen.getByText('Must be unique.')).toBeTruthy();
  });
});

describe('Tooltip (native)', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('appears on long-press, lingers after release, and becomes the trigger hint', async () => {
    jest.useFakeTimers({ doNotFake: ['queueMicrotask', 'nextTick'] });
    await render(
      ui(
        <Tooltip content="Copy link" testID="tt">
          <Button>Copy</Button>
        </Tooltip>,
      ),
    );
    expect(screen.getByRole('button', { name: 'Copy' }).props.accessibilityHint).toBe('Copy link');
    await fireEvent(screen.getByTestId('tt'), 'touchStart');
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(screen.queryByText('Copy link')).toBeNull();
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    expect(screen.getByText('Copy link')).toBeTruthy();
    await fireEvent(screen.getByTestId('tt'), 'touchEnd');
    await act(async () => {
      jest.advanceTimersByTime(1600);
    });
    expect(screen.queryByText('Copy link')).toBeNull();
  });
});

describe('DropdownMenu (native)', () => {
  it('opens grouped items, runs actions and keeps open for checkbox items', async () => {
    const edit = jest.fn();
    function Demo() {
      const [compact, setCompact] = useState(false);
      return (
        <DropdownMenu
          trigger="Actions"
          testID="dm"
          items={[
            { label: 'Edit', onPress: edit, group: 'Issue' },
            { label: 'Compact', isChecked: compact, onCheckedChange: setCompact, group: 'View' },
          ]}
        />
      );
    }
    await render(ui(<Demo />));
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await fireEvent.press(trigger);
    expect(trigger.props.accessibilityState.expanded).toBe(true);
    expect(screen.getByRole('header', { name: 'Issue' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Compact' }));
    expect(screen.getByRole('checkbox', { name: 'Compact' }).props.accessibilityState.checked).toBe(
      true,
    );
    await fireEvent.press(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(edit).toHaveBeenCalled();
    expect(screen.queryByRole('menuitem', { name: 'Edit' })).toBeNull();
  });
});

describe('Drawer (native)', () => {
  it('shows a titled sheet that closes from the button, blanket and a swipe down', async () => {
    const onClose = jest.fn();
    await render(
      ui(
        <Drawer isOpen onClose={onClose} title="Filters" testID="d">
          <Text>Body</Text>
        </Drawer>,
      ),
    );
    expect(screen.getByRole('header', { name: 'Filters' })).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));
    await fireEvent.press(screen.getByTestId('d-blanket', { includeHiddenElements: true }));
    expect(onClose).toHaveBeenCalledTimes(2);
    await act(async () => {
      fireEvent(screen.getByTestId('d'), 'layout', {
        nativeEvent: { layout: { height: 400, width: 300, x: 0, y: 0 } },
      });
    });
    fireGestureHandler(getByGestureTestId('d-pan'), [
      { state: State.BEGAN, translationY: 0 },
      { state: State.ACTIVE, translationY: 100 },
      { state: State.ACTIVE, translationY: 200 },
      { state: State.END, translationY: 200, velocityY: 0 },
    ]);
    await flush();
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('unmounts after closing', async () => {
    const onCloseComplete = jest.fn();
    const { rerender } = await render(
      ui(<Drawer isOpen onClose={() => {}} title="Filters" onCloseComplete={onCloseComplete} />),
    );
    await rerender(
      ui(
        <Drawer
          isOpen={false}
          onClose={() => {}}
          title="Filters"
          onCloseComplete={onCloseComplete}
        />,
      ),
    );
    await flush();
    expect(screen.queryByText('Filters')).toBeNull();
    expect(onCloseComplete).toHaveBeenCalled();
  });
});

describe('Flags above overlays (native)', () => {
  it('renders flags once, inside an open modal', async () => {
    let show!: ReturnType<typeof useFlags>['showFlag'];
    function Grab() {
      show = useFlags().showFlag;
      return null;
    }
    await render(
      ui(
        <FlagProvider>
          <Grab />
          <Modal isOpen onClose={() => {}} title="Edit" testID="m">
            <Text>Form</Text>
          </Modal>
        </FlagProvider>,
      ),
    );
    await act(async () => {
      show({ id: 'saved', title: 'Saved' });
    });
    expect(screen.getAllByText('Saved')).toHaveLength(1);
  });
});

describe('Navigation (native)', () => {
  it('Tabs switch panels and move the indicator', async () => {
    const onChange = jest.fn();
    await render(
      ui(
        <Tabs
          testID="t"
          onChange={onChange}
          tabs={[
            { id: 'a', label: 'Overview', content: 'Overview panel' },
            { id: 'b', label: 'Activity', content: 'Activity panel' },
          ]}
        />,
      ),
    );
    expect(screen.getByRole('tab', { name: 'Overview' }).props.accessibilityState.selected).toBe(
      true,
    );
    expect(screen.getByText('Overview panel')).toBeTruthy();
    await fireEvent.press(screen.getByRole('tab', { name: 'Activity' }));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.getByText('Activity panel')).toBeTruthy();
  });

  it('Breadcrumbs collapse, expand and open links', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const items = ['Home', 'Projects', 'Design', 'Tabs'].map((label) => ({
      label,
      href: `https://x/${label}`,
    }));
    await render(ui(<Breadcrumbs items={items} maxItems={3} />));
    expect(screen.queryByText('Projects')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Show more breadcrumbs' }));
    await fireEvent.press(screen.getByRole('link', { name: 'Projects' }));
    expect(open).toHaveBeenCalledWith('https://x/Projects');
  });

  it('Pagination marks the current page and moves', async () => {
    const onChange = jest.fn();
    await render(ui(<Pagination pages={5} onChange={onChange} />));
    expect(screen.getByRole('button', { name: 'Page 1' }).props.accessibilityState.selected).toBe(
      true,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Next' }));
    expect(onChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole('button', { name: 'Page 2' }).props.accessibilityState.selected).toBe(
      true,
    );
  });
});
