import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { createRef } from 'react';
import { Linking, Text, View } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';
import {
  Avatar,
  AvatarGroup,
  Field,
  IconButton,
  LinkButton,
  Range,
  Select,
  SplitButton,
  TextArea,
  ThemeProvider,
} from '../../index.native';

const ui = (children: React.ReactNode) => (
  <ThemeProvider motion="reduced">{children}</ThemeProvider>
);
const flush = () => act(async () => {});

// Jest's mocked View never answers measureInWindow, so anchored menus would never open.
// Patch the class it actually renders to report a fixed frame.
beforeAll(async () => {
  const ref = createRef<View>();
  await render(<View ref={ref} />);
  const proto = Object.getPrototypeOf(ref.current) as {
    measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => void;
  };
  proto.measureInWindow = (cb) => cb(16, 100, 240, 40);
});

describe('Actions (native)', () => {
  it('IconButton is a labelled button', async () => {
    const onPress = jest.fn();
    await render(ui(<IconButton icon="cross" label="Close" onPress={onPress} />));
    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('LinkButton has the link role and opens its URL', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    await render(ui(<LinkButton href="https://example.com">Docs</LinkButton>));
    await fireEvent.press(screen.getByRole('link', { name: 'Docs' }));
    expect(open).toHaveBeenCalledWith('https://example.com');
  });

  it('SplitButton opens a menu of secondary actions', async () => {
    const main = jest.fn();
    const dup = jest.fn();
    await render(
      ui(
        <SplitButton onPress={main} items={[{ label: 'Duplicate', onPress: dup }]} testID="s">
          Publish
        </SplitButton>,
      ),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Publish' }));
    expect(main).toHaveBeenCalled();
    const trigger = screen.getByRole('button', { name: 'More actions' });
    await fireEvent.press(trigger);
    expect(trigger.props.accessibilityState.expanded).toBe(true);
    await fireEvent.press(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(dup).toHaveBeenCalled();
    expect(screen.queryByRole('menuitem', { name: 'Duplicate' })).toBeNull();
  });
});

describe('Forms (native)', () => {
  const options = [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Team', isDisabled: true },
  ];

  it('Select opens its options and picks one', async () => {
    const onChange = jest.fn();
    await render(ui(<Select label="Plan" options={options} onChange={onChange} testID="s" />));
    const trigger = screen.getByRole('button', { name: 'Plan, Select…' });
    await fireEvent.press(trigger);
    expect(screen.getByRole('menuitem', { name: 'Team' }).props.accessibilityState.disabled).toBe(
      true,
    );
    await fireEvent.press(screen.getByRole('menuitem', { name: 'Pro' }));
    expect(onChange).toHaveBeenCalledWith('pro');
    expect(screen.getByRole('button', { name: 'Plan, Pro' })).toBeTruthy();
  });

  it('Select closes from the backdrop without changing', async () => {
    const onChange = jest.fn();
    await render(ui(<Select label="Plan" options={options} onChange={onChange} testID="s" />));
    await fireEvent.press(screen.getByRole('button', { name: 'Plan, Select…' }));
    await fireEvent.press(screen.getByTestId('s-options-backdrop'));
    expect(screen.queryByRole('menuitem', { name: 'Pro' })).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('TextArea is multi-line, counts characters and shows errors', async () => {
    const onChange = jest.fn();
    await render(
      ui(
        <TextArea
          label="Notes"
          onChange={onChange}
          maxCharacters={10}
          isInvalid
          errorMessage="Too short"
          testID="t"
        />,
      ),
    );
    const input = screen.getByTestId('t-input');
    expect(input.props.multiline).toBe(true);
    await fireEvent.changeText(input, 'Hello');
    expect(onChange).toHaveBeenCalledWith('Hello');
    expect(screen.getByText('5 characters remaining')).toBeTruthy();
    expect(screen.getByText('Too short')).toBeTruthy();
  });

  it('Range is adjustable by screen readers and by dragging', async () => {
    const onChange = jest.fn();
    await render(ui(<Range label="Volume" defaultValue={50} onChange={onChange} testID="r" />));
    const r = screen.getByRole('adjustable', { name: 'Volume' });
    expect(r.props.accessibilityValue).toMatchObject({ min: 0, max: 100, now: 50 });
    await fireEvent(r, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(onChange).toHaveBeenLastCalledWith(60);
    // Give the track a width, then drag to 25% (x includes the half-thumb inset).
    await act(async () => {
      fireEvent(screen.getByTestId('r-track'), 'layout', {
        nativeEvent: { layout: { width: 200, height: 4, x: 0, y: 0 } },
      });
    });
    fireGestureHandler(getByGestureTestId('r-pan'), [
      { state: State.BEGAN, x: 8 },
      { state: State.ACTIVE, x: 30 },
      { state: State.ACTIVE, x: 58 },
      { state: State.END, x: 58 },
    ]);
    await flush();
    expect(onChange).toHaveBeenLastCalledWith(25);
  });

  it('Field labels a control and shows its message', async () => {
    await render(
      ui(
        <Field label="Website" helperMessage="Include https://" testID="f">
          <Text>control</Text>
        </Field>,
      ),
    );
    expect(screen.getByText('Website')).toBeTruthy();
    expect(screen.getByText('Include https://')).toBeTruthy();
  });
});

describe('People (native)', () => {
  it('Avatar shows initials and presence in its label', async () => {
    await render(ui(<Avatar name="Ada Lovelace" presence="busy" />));
    expect(screen.getByRole('image', { name: 'Ada Lovelace (busy)' })).toBeTruthy();
    expect(screen.getByText('AL')).toBeTruthy();
  });

  it('Avatar falls back to initials when the image fails', async () => {
    await render(ui(<Avatar name="Grace Hopper" src="https://x/y.png" testID="a" />));
    await fireEvent(screen.getByTestId('a-image', { includeHiddenElements: true }), 'error');
    expect(screen.queryByTestId('a-image', { includeHiddenElements: true })).toBeNull();
    expect(screen.getByText('GH')).toBeTruthy();
  });

  it('AvatarGroup expands from the +N button', async () => {
    const people = ['A B', 'C D', 'E F', 'G H', 'I J', 'K L'].map((name) => ({ name }));
    await render(ui(<AvatarGroup data={people} maxCount={3} testID="g" />));
    expect(screen.getAllByRole('image')).toHaveLength(2);
    await fireEvent.press(screen.getByRole('button', { name: 'Show 4 more' }));
    expect(screen.getAllByRole('image')).toHaveLength(6);
  });
});
