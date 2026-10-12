import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Box, Heading, Icon, Inline, Pressable, Stack, Text, createTheme } from '../../index.web';
import { frames, renderThemed, rgb, theme } from '../internal/testUtils.web';

afterEach(cleanup);

describe('Box (web)', () => {
  it('maps spacing, color, border and radius tokens to styles', () => {
    renderThemed(
      <Box
        testID="b"
        as="section"
        padding="200"
        paddingX="300"
        backgroundColor="color.background.neutral"
        borderColor="color.border"
        borderWidth="default"
        borderRadius="large"
        style={{ minWidth: 10 }}
      >
        hi
      </Box>,
    );
    const el = screen.getByTestId('b');
    expect(el.tagName).toBe('SECTION');
    expect(el.style.paddingLeft).toBe('24px');
    expect(el.style.paddingTop).toBe('16px');
    expect(el.style.backgroundColor).toBe(rgb(theme.color['color.background.neutral']));
    expect(el.style.borderRadius).toBe('8px');
    expect(el.style.borderWidth).toBe('1px');
    expect(el.style.minWidth).toBe('10px');
  });
});

describe('Stack and Inline (web)', () => {
  it('lay children out with token gaps', () => {
    renderThemed(
      <>
        <Stack testID="s" space="100" alignInline="center">
          <span>a</span>
          <span>b</span>
        </Stack>
        <Inline testID="i" space="200" rowSpace="050" spread="space-between" shouldWrap>
          <span>a</span>
        </Inline>
      </>,
    );
    const s = screen.getByTestId('s').style;
    expect([s.flexDirection, s.gap, s.alignItems]).toEqual(['column', '8px', 'center']);
    const i = screen.getByTestId('i').style;
    expect([i.flexDirection, i.columnGap, i.rowGap, i.justifyContent, i.flexWrap]).toEqual([
      'row',
      '16px',
      '4px',
      'space-between',
      'wrap',
    ]);
  });

  it('puts a separator between children only', () => {
    renderThemed(
      <Inline separator="·">
        <span>One</span>
        <span>Two</span>
        <span>Three</span>
      </Inline>,
    );
    expect(screen.getAllByText('·')).toHaveLength(2);
  });
});

describe('Text and Heading (web)', () => {
  it('use the type scale and theme colors', () => {
    renderThemed(
      <>
        <Text testID="t" size="small" weight="bold" color="color.text.subtle" maxLines={1}>
          Body
        </Text>
        <Heading testID="h" size="large">
          Title
        </Heading>
      </>,
    );
    const t = screen.getByTestId('t');
    expect([t.tagName, t.style.fontSize, t.style.lineHeight, t.style.fontWeight]).toEqual([
      'SPAN',
      '12px',
      '16px',
      '653',
    ]);
    expect(t.style.color).toBe(rgb(theme.color['color.text.subtle']));
    expect(t.style.textOverflow).toBe('ellipsis');
    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBe(screen.getByTestId('h'));
    expect(screen.getByTestId('h').style.fontSize).toBe('24px');
  });

  it('lets the heading level differ from its size', () => {
    renderThemed(
      <Heading size="small" as="h1">
        Page
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Page' })).toBeTruthy();
  });
});

describe('Icon (web)', () => {
  it('is decorative by default and labelled when asked', () => {
    renderThemed(
      <>
        <Icon glyph="check" testID="a" />
        <Icon glyph="warning" label="Warning" size="large" />
      </>,
    );
    expect(screen.getByTestId('a').getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByRole('img', { name: 'Warning' })).toBeTruthy();
  });

  it('sizes and colors every glyph', () => {
    renderThemed(
      <>
        {(['add', 'remove', 'cross', 'check', 'chevron-down', 'chevron-left'] as const).map((g) => (
          <Icon key={g} glyph={g} size={20} color="color.icon.danger" testID={g} />
        ))}
      </>,
    );
    const add = screen.getByTestId('add');
    expect(add.style.width).toBe('20px');
    const bar = add.firstElementChild as HTMLElement;
    expect(bar.style.background).toBe(rgb(theme.color['color.icon.danger']));
    expect(screen.getByTestId('chevron-down').children).toHaveLength(1);
  });
});

describe('Pressable (web)', () => {
  it('is a button that calls onPress and passes its state to children', async () => {
    const onPress = vi.fn();
    renderThemed(
      <Pressable onPress={onPress} accessibilityLabel="Open card" testID="p">
        {({ hovered }) => <span>{hovered ? 'hovered' : 'idle'}</span>}
      </Pressable>,
    );
    const btn = screen.getByRole('button', { name: 'Open card' });
    await userEvent.hover(btn);
    expect(screen.getByText('hovered')).toBeTruthy();
    await userEvent.click(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
    await frames();
    expect(btn.style.backgroundColor).toBe(
      rgb(theme.color['color.background.neutral.subtle.hovered']),
    );
  });

  it('ignores presses when disabled and dims', async () => {
    const onPress = vi.fn();
    renderThemed(
      <Pressable onPress={onPress} isDisabled>
        Go
      </Pressable>,
    );
    const btn = screen.getByRole('button', { name: 'Go' }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    await userEvent.click(btn);
    expect(onPress).not.toHaveBeenCalled();
    expect(btn.style.opacity).toBe('0.4');
  });

  it('takes token overrides from the theme and the instance', async () => {
    const t = createTheme({ components: { Pressable: { tokens: { radius: 12 } } } });
    renderThemed(
      <Pressable tokens={{ background: '#112233' }} testID="p">
        x
      </Pressable>,
      { theme: t },
    );
    await frames();
    const btn = screen.getByTestId('p');
    expect(btn.style.borderRadius).toBe('12px');
    expect(btn.style.backgroundColor).toBe('rgb(17, 34, 51)');
  });
});

describe('Icon status colors (web)', () => {
  it('default status glyphs to their semantic color', () => {
    renderThemed(<Icon glyph="error" testID="e" />);
    const circle = screen.getByTestId('e').firstElementChild as HTMLElement;
    expect(circle.style.background).toBe(rgb(theme.color['color.icon.danger']));
  });
});
