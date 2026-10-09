import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
} from '../index.web';

afterEach(cleanup);

describe('web components', () => {
  it('Box maps spacing and color tokens to styles', () => {
    render(<Box testID="box" p={4} bg="primary" radius="md" />);
    const el = screen.getByTestId('box');
    expect(el.style.paddingTop).toBe('16px');
    expect(el.style.borderRadius).toBe('8px');
    expect(el.style.backgroundColor).toBe('rgb(37, 99, 235)');
    expect(el.style.flexDirection).toBe('column');
  });

  it('HStack lays out in a row with a gap', () => {
    render(<HStack testID="stack" gap={2} />);
    expect(screen.getByTestId('stack').style.flexDirection).toBe('row');
    expect(screen.getByTestId('stack').style.gap).toBe('8px');
  });

  it('Text renders semantic elements and follows the theme', () => {
    render(
      <ThemeProvider theme="dark">
        <Text variant="title">Hello</Text>
      </ThemeProvider>,
    );
    const heading = screen.getByRole('heading', { level: 1, name: 'Hello' });
    expect(heading.style.color).toBe(hexToRgb(darkTheme.colors.text));
    expect(heading.style.lineHeight).toBe('36px');
  });

  it('Button calls onPress and respects disabled', () => {
    const onPress = vi.fn();
    const { rerender } = render(<Button onPress={onPress}>Save</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);

    rerender(
      <Button onPress={onPress} disabled>
        Save
      </Button>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('Input reports text changes and links its label and error', () => {
    const onChangeText = vi.fn();
    render(<Input label="Email" error="Required" onChangeText={onChangeText} />);
    const input = screen.getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'a@b.co' } });
    expect(onChangeText).toHaveBeenCalledWith('a@b.co');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Required').id).toBe(input.getAttribute('aria-describedby'));
  });

  it('Card and Badge render their content', () => {
    render(
      <Card testID="card">
        <Badge tone="success">New</Badge>
      </Card>,
    );
    expect(screen.getByTestId('card').style.boxShadow).not.toBe('');
    expect(screen.getByText('New').style.color).toBe(hexToRgb(lightTheme.colors.success));
  });
});

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}
