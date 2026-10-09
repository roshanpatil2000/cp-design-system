import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, VStack } from 'cp-design-system';

const meta = {
  title: 'Components/Text',
  component: Text,
  args: { children: 'The quick brown fox jumps over the lazy dog' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['title', 'heading', 'subheading', 'body', 'label', 'caption'],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scale: Story = {
  render: () => (
    <VStack gap={2}>
      <Text variant="title">Title</Text>
      <Text variant="heading">Heading</Text>
      <Text variant="subheading">Subheading</Text>
      <Text>Body text for paragraphs and general content.</Text>
      <Text variant="label">Label</Text>
      <Text variant="caption" color="textMuted">
        Caption
      </Text>
    </VStack>
  ),
};
