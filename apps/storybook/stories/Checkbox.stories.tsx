import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from 'cp-design-system';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Remember me' },
  argTypes: {
    motion: { control: 'select', options: [undefined, 'snappy', 'gentle', 'bouncy', false] },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 4 }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" isIndeterminate />
      <Checkbox label="Invalid" isInvalid />
      <Checkbox label="Required" isRequired />
      <Checkbox label="Disabled" isDisabled />
      <Checkbox label="Disabled, checked" isDisabled defaultChecked />
      <Checkbox label="Disabled, indeterminate" isDisabled isIndeterminate />
    </div>
  ),
};

function SelectAll() {
  const items = ['Email', 'Push notifications', 'SMS'];
  const [chosen, setChosen] = useState<string[]>(['Email']);
  const all = chosen.length === items.length;
  return (
    <div>
      <Checkbox
        label="All notifications"
        isChecked={all}
        isIndeterminate={chosen.length > 0 && !all}
        onChange={(on) => setChosen(on ? items : [])}
      />
      <div style={{ paddingLeft: 24 }}>
        {items.map((item) => (
          <div key={item}>
            <Checkbox
              label={item}
              isChecked={chosen.includes(item)}
              onChange={(on) => setChosen((c) => (on ? [...c, item] : c.filter((x) => x !== item)))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const Indeterminate: Story = {
  name: 'Select all (mixed state)',
  render: () => <SelectAll />,
};

export const CustomTokens: Story = {
  name: 'Custom tokens',
  render: () => (
    <div style={{ display: 'grid', gap: 4 }}>
      <Checkbox label="Rounder, violet" defaultChecked tokens={{ radius: 7, checked: '#7C3AED' }} />
      <Checkbox
        label="Larger control"
        defaultChecked
        tokens={{ size: 20, hitSize: 28, radius: 6 }}
      />
      <Checkbox label="Bouncy" motion="bouncy" />
    </div>
  ),
};
