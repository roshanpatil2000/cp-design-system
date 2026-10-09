import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Box, Button, Card, HStack, Text, VStack } from 'cp-design-system';

const meta = { title: 'Components/Layout' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BoxAndStack: Story = {
  render: () => (
    <VStack gap={4}>
      <HStack gap={2}>
        {[1, 2, 3].map((n) => (
          <Box key={n} p={4} bg="primarySubtle" radius="md">
            <Text color="primary">Box {n}</Text>
          </Box>
        ))}
      </HStack>
      <Box p={4} borderWidth={1} radius="lg" justify="space-between" direction="row">
        <Text>Left</Text>
        <Text>Right</Text>
      </Box>
    </VStack>
  ),
};

export const Badges: Story = {
  render: () => (
    <HStack gap={2}>
      <Badge>Neutral</Badge>
      <Badge tone="primary">Primary</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="danger">Danger</Badge>
    </HStack>
  ),
};

export const CardExample: Story = {
  name: 'Card',
  render: () => (
    <Box width={360}>
      <Card>
        <VStack gap={3}>
          <HStack justify="space-between">
            <Text variant="subheading">Pro plan</Text>
            <Badge tone="success">Active</Badge>
          </HStack>
          <Text color="textMuted">Unlimited projects, priority support and team sharing.</Text>
          <HStack gap={2}>
            <Button size="sm">Manage</Button>
            <Button size="sm" variant="ghost" tone="danger">
              Cancel
            </Button>
          </HStack>
        </VStack>
      </Card>
    </Box>
  ),
};
