import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup, Inline, Stack, Text } from 'cp-design-system';

const meta = { title: 'People/Overview' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const names = [
  'Ada Lovelace',
  'Grace Hopper',
  'Alan Turing',
  'Margaret Hamilton',
  'Linus Torvalds',
  'Katherine Johnson',
  'Dennis Ritchie',
  'Barbara Liskov',
  'Ken Thompson',
];

export const Avatars: Story = {
  render: () => (
    <Stack space="300">
      <Inline space="200" alignBlock="end">
        {(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((s) => (
          <Avatar key={s} name="Ada Lovelace" size={s} />
        ))}
      </Inline>
      <Inline space="200" alignBlock="center">
        <Avatar name="Grace Hopper" size="large" presence="online" />
        <Avatar name="Alan Turing" size="large" presence="busy" />
        <Avatar name="Margaret Hamilton" size="large" presence="focus" />
        <Avatar name="Linus Torvalds" size="large" presence="offline" />
        <Avatar name="Design team" size="large" appearance="square" />
        <Avatar name="Broken image" size="large" src="https://example.invalid/x.png" />
        <Avatar name="Pressable" size="large" onPress={() => {}} />
      </Inline>
    </Stack>
  ),
};

export const Groups: Story = {
  render: () => (
    <Stack space="300">
      <Text size="small" color="color.text.subtle">
        Hover the stack; click +N to expand.
      </Text>
      <AvatarGroup data={names.map((name) => ({ name }))} size="large" />
      <AvatarGroup data={names.map((name) => ({ name }))} appearance="grid" maxCount={20} />
    </Stack>
  ),
};
