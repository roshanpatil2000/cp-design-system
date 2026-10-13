import { describe, expect, it, jest } from '@jest/globals';
import { StyleSheet, Text as RNText } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { getAnimatedStyle } from 'react-native-reanimated';
import {
  Box,
  Heading,
  Icon,
  Inline,
  Pressable,
  Stack,
  Text,
  ThemeProvider,
  createTheme,
} from '../../index.native';

const theme = createTheme().light;
const ui = (children: React.ReactNode) => (
  <ThemeProvider motion="reduced">{children}</ThemeProvider>
);
const flat = (id: string) => StyleSheet.flatten(screen.getByTestId(id).props.style);

describe('Box, Stack and Inline (native)', () => {
  it('map tokens to View styles', async () => {
    await render(
      ui(
        <>
          <Box
            testID="b"
            padding="200"
            backgroundColor="color.background.neutral"
            borderRadius="large"
          />
          <Stack testID="s" space="100" alignInline="center" />
          <Inline testID="i" space="200" shouldWrap separator="·">
            <RNText>One</RNText>
            <RNText>Two</RNText>
          </Inline>
        </>,
      ),
    );
    expect(flat('b')).toMatchObject({
      padding: 16,
      backgroundColor: theme.color['color.background.neutral'],
      borderRadius: 8,
    });
    expect(flat('s')).toMatchObject({ flexDirection: 'column', gap: 8, alignItems: 'center' });
    expect(flat('i')).toMatchObject({ flexDirection: 'row', columnGap: 16, flexWrap: 'wrap' });
    expect(screen.getAllByText('·')).toHaveLength(1);
  });
});

describe('Text and Heading (native)', () => {
  it('use the type scale; headings are headers', async () => {
    await render(
      ui(
        <>
          <Text testID="t" size="large" weight="semibold" maxLines={2}>
            Body
          </Text>
          <Heading size="xxlarge">Title</Heading>
        </>,
      ),
    );
    const t = screen.getByTestId('t');
    expect(t.props.numberOfLines).toBe(2);
    expect(StyleSheet.flatten(t.props.style)).toMatchObject({
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    });
    const h = screen.getByRole('header', { name: 'Title' });
    expect(StyleSheet.flatten(h.props.style).fontSize).toBe(32);
  });
});

describe('Icon (native)', () => {
  it('is hidden unless labelled', async () => {
    await render(
      ui(
        <>
          <Icon glyph="check" testID="a" />
          <Icon glyph="error" label="Error" />
        </>,
      ),
    );
    expect(screen.getByTestId('a', { includeHiddenElements: true }).props.accessible).toBe(false);
    expect(screen.queryByTestId('a')).toBeNull();
    expect(screen.getByRole('image', { name: 'Error' })).toBeTruthy();
  });
});

describe('Pressable (native)', () => {
  it('presses, squishes and respects disabled', async () => {
    const onPress = jest.fn();
    const { rerender } = await render(
      ui(
        <Pressable onPress={onPress} accessibilityLabel="Card" testID="p">
          <RNText>Card</RNText>
        </Pressable>,
      ),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Card' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    await rerender(
      ui(
        <Pressable onPress={onPress} accessibilityLabel="Card" isDisabled>
          <RNText>Card</RNText>
        </Pressable>,
      ),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Card' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows the pressed background while held', async () => {
    await render(
      ui(
        <Pressable accessibilityLabel="Row" testID="p" tokens={{ backgroundPressed: '#123456' }}>
          <RNText testID="child">Row</RNText>
        </Pressable>,
      ),
    );
    await fireEvent(screen.getByRole('button', { name: 'Row' }), 'pressIn');
    await waitFor(() =>
      expect(getAnimatedStyle(screen.getByTestId('p-surface')).backgroundColor).toBe('#123456'),
    );
  });
});
