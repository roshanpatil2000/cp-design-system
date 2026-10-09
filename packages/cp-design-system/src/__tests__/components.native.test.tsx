import { describe, expect, it, jest } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Input,
  Text,
  ThemeProvider,
  darkTheme,
  lightTheme,
} from '../index.native';

describe('native components', () => {
  it('Box maps spacing and color tokens to styles', async () => {
    await render(<Box testID="box" p={4} bg="primary" radius="md" />);
    const style = StyleSheet.flatten(screen.getByTestId('box').props.style);
    expect(style).toMatchObject({
      paddingTop: 16,
      borderRadius: 8,
      backgroundColor: lightTheme.colors.primary,
      flexDirection: 'column',
    });
  });

  it('HStack lays out in a row with a gap', async () => {
    await render(<HStack testID="stack" gap={2} />);
    const style = StyleSheet.flatten(screen.getByTestId('stack').props.style);
    expect(style).toMatchObject({ flexDirection: 'row', gap: 8 });
  });

  it('Text follows the theme and marks headings', async () => {
    await render(
      <ThemeProvider theme="dark">
        <Text variant="title">Hello</Text>
      </ThemeProvider>,
    );
    const text = screen.getByRole('header', { name: 'Hello' });
    expect(StyleSheet.flatten(text.props.style)).toMatchObject({
      color: darkTheme.colors.text,
      lineHeight: 36,
    });
  });

  it('Button calls onPress and respects disabled', async () => {
    const onPress = jest.fn();
    const { rerender } = await render(<Button onPress={onPress}>Save</Button>);
    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);

    await rerender(
      <Button onPress={onPress} disabled>
        Save
      </Button>,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('Input reports text changes and shows its error', async () => {
    const onChangeText = jest.fn();
    await render(
      <Input testID="input" label="Email" error="Required" onChangeText={onChangeText} />,
    );
    await fireEvent.changeText(screen.getByTestId('input'), 'a@b.co');
    expect(onChangeText).toHaveBeenCalledWith('a@b.co');
    expect(screen.getByText('Required')).toBeTruthy();
  });

  it('Card and Badge render their content', async () => {
    await render(
      <Card testID="card">
        <Badge tone="success">New</Badge>
      </Card>,
    );
    expect(StyleSheet.flatten(screen.getByTestId('card').props.style)).toMatchObject({
      elevation: 2,
    });
    expect(StyleSheet.flatten(screen.getByText('New').props.style)).toMatchObject({
      color: lightTheme.colors.success,
    });
  });
});
