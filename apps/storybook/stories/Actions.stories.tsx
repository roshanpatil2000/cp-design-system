import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton, Inline, LinkButton, SplitButton, Stack, Text } from 'cp-design-system';

const meta = { title: 'Actions/Overview' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const IconButtons: Story = {
  render: () => (
    <Stack space="200">
      {(['default', 'subtle', 'primary', 'danger'] as const).map((a) => (
        <Inline key={a} space="100" alignBlock="center">
          <IconButton icon="add" label="Add" appearance={a} />
          <IconButton icon="cross" label="Close" appearance={a} spacing="compact" />
          <IconButton icon="chevron-right" label="Next" appearance={a} shape="circle" />
          <IconButton icon="check" label="Done" appearance={a} isDisabled />
          <Text size="small" color="color.text.subtle">
            {a}
          </Text>
        </Inline>
      ))}
    </Stack>
  ),
};

export const LinkButtons: Story = {
  render: () => (
    <Inline space="100">
      <LinkButton href="https://atlassian.design" target="_blank" appearance="primary">
        Atlassian Design
      </LinkButton>
      <LinkButton href="#docs">Read the docs</LinkButton>
      <LinkButton href="#gone" isDisabled>
        Unavailable
      </LinkButton>
    </Inline>
  ),
};

function Split() {
  const [log, setLog] = useState('');
  const items = [
    { label: 'Save as draft', onPress: () => setLog('Saved as draft') },
    { label: 'Schedule…', onPress: () => setLog('Scheduling') },
    { label: 'Publish to everyone', onPress: () => setLog('Published'), isDisabled: true },
  ];
  return (
    <Stack space="200" alignInline="start">
      <Inline space="200">
        <SplitButton appearance="primary" items={items} onPress={() => setLog('Published')}>
          Publish
        </SplitButton>
        <SplitButton items={items} onPress={() => setLog('Saved')} spacing="compact">
          Save
        </SplitButton>
      </Inline>
      <Text size="small" color="color.text.subtle">
        {log || 'Use the arrow for more actions (keyboard works too).'}
      </Text>
    </Stack>
  );
}

export const SplitButtons: Story = { render: () => <Split /> };
