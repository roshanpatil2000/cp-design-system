import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, HStack, VStack } from 'cp-design-system';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button', onPress: () => {} },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost'] },
    tone: { control: 'inline-radio', options: ['primary', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <VStack gap={4}>
      {(['primary', 'danger'] as const).map((tone) => (
        <HStack key={tone}>
          <Button tone={tone}>Solid</Button>
          <Button tone={tone} variant="outline">
            Outline
          </Button>
          <Button tone={tone} variant="ghost">
            Ghost
          </Button>
          <Button tone={tone} disabled>
            Disabled
          </Button>
        </HStack>
      ))}
    </VStack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <HStack>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </HStack>
  ),
};
