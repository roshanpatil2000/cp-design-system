import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Box,
  Heading,
  Icon,
  Inline,
  Pressable,
  Stack,
  Text,
  type IconGlyph,
} from 'cp-design-system';

const meta = { title: 'Building blocks/Overview' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  render: () => (
    <Stack space="150">
      {(['xxlarge', 'xlarge', 'large', 'medium', 'small', 'xsmall', 'xxsmall'] as const).map(
        (s) => (
          <Heading key={s} size={s} as="div">
            Heading {s}
          </Heading>
        ),
      )}
      <Text size="large">Body large: the quick brown fox jumps over the lazy dog.</Text>
      <Text>
        Body medium, with a <Text weight="bold">bold</Text> word and a{' '}
        <Text color="color.text.subtle">subtle</Text> one.
      </Text>
      <Text size="small" color="color.text.subtlest">
        Body small, subtlest.
      </Text>
      <Box style={{ width: 240 }}>
        <Text maxLines={2}>
          Long text truncated to two lines with an ellipsis so cards keep a steady height no matter
          what users type into them.
        </Text>
      </Box>
    </Stack>
  ),
};

export const Layout: Story = {
  render: () => (
    <Stack space="300">
      <Box
        padding="200"
        backgroundColor="elevation.surface.raised"
        borderColor="color.border"
        borderWidth="default"
        borderRadius="large"
      >
        <Stack space="100">
          <Heading size="small">Box + Stack</Heading>
          <Text>Padding, surface, border and radius all come from tokens.</Text>
        </Stack>
      </Box>
      <Inline space="100" separator="·" alignBlock="center">
        <Text>Inline</Text>
        <Text>with</Text>
        <Text>separators</Text>
      </Inline>
      <Inline space="100" shouldWrap>
        {Array.from({ length: 12 }, (_, i) => (
          <Box
            key={i}
            padding="100"
            backgroundColor="color.background.neutral"
            borderRadius="small"
          >
            <Text size="small">Item {i + 1}</Text>
          </Box>
        ))}
      </Inline>
    </Stack>
  ),
};

const glyphs: IconGlyph[] = [
  'check',
  'cross',
  'add',
  'remove',
  'chevron-up',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'info',
  'success',
  'warning',
  'error',
];

export const Icons: Story = {
  render: () => (
    <Stack space="200">
      {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
        <Inline key={size} space="200" alignBlock="center">
          <Box style={{ width: 64 }}>
            <Text size="small" color="color.text.subtle">
              {size}
            </Text>
          </Box>
          {glyphs.map((g) => (
            <Icon
              key={g}
              glyph={g}
              size={size}
              color={g === 'error' ? 'color.icon.danger' : undefined}
            />
          ))}
        </Inline>
      ))}
    </Stack>
  ),
};

export const PressableCards: Story = {
  name: 'Pressable',
  render: () => (
    <Inline space="200">
      {['Design', 'Engineering', 'Marketing'].map((team) => (
        <Pressable key={team} padding="200" onPress={() => {}} tokens={{ radius: 8 }}>
          {({ hovered }) => (
            <Stack space="050">
              <Heading size="xsmall" as="div">
                {team}
              </Heading>
              <Inline space="050" alignBlock="center">
                <Text size="small" color="color.text.subtle">
                  Open
                </Text>
                <Icon
                  glyph="chevron-right"
                  size="small"
                  color={hovered ? 'color.icon.brand' : 'color.icon.subtle'}
                />
              </Inline>
            </Stack>
          )}
        </Pressable>
      ))}
    </Inline>
  ),
};
