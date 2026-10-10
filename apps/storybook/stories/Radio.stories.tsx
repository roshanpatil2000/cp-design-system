import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from 'cp-design-system';

const options = [
  { value: 'free', label: 'Free' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Enterprise (contact sales)', isDisabled: true },
];

const meta = {
  title: 'Components/Radio group',
  component: RadioGroup,
  args: { label: 'Plan', options, defaultValue: 'standard' },
  argTypes: {
    direction: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    motion: { control: 'select', options: [undefined, 'snappy', 'gentle', 'bouncy', false] },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = { args: { direction: 'horizontal' } };

export const Invalid: Story = { args: { isInvalid: true, defaultValue: null, isRequired: true } };

export const Disabled: Story = { args: { isDisabled: true } };

function Controlled() {
  const [value, setValue] = useState('standard');
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <RadioGroup label="Plan" options={options} value={value} onChange={setValue} />
      <span style={{ fontSize: 12, opacity: 0.7 }}>Selected: {value}</span>
    </div>
  );
}

export const ControlledValue: Story = { name: 'Controlled', render: () => <Controlled /> };
