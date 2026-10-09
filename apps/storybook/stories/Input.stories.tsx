import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, Text, VStack } from 'cp-design-system';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { label: 'Email', placeholder: 'you@example.com', keyboardType: 'email' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <VStack gap={4} width={320}>
      <Input label="Name" placeholder="Jane Doe" helperText="As it appears on your ID" />
      <Input label="Password" secureTextEntry defaultValue="secret" />
      <Input label="Email" defaultValue="not-an-email" error="Enter a valid email address" />
      <Input label="Disabled" defaultValue="Can't edit me" disabled />
    </VStack>
  ),
};

function ControlledInput() {
  const [value, setValue] = useState('');
  return (
    <VStack gap={2} width={320}>
      <Input label="Controlled" value={value} onChangeText={setValue} placeholder="Type…" />
      <Text variant="caption" color="textMuted">
        Value: {value || '(empty)'}
      </Text>
    </VStack>
  );
}

export const Controlled: Story = { render: () => <ControlledInput /> };
