import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Checkbox,
  Drawer,
  DropdownMenu,
  IconButton,
  InlineDialog,
  Inline,
  Popup,
  Stack,
  Text,
  TextField,
  Tooltip,
} from 'cp-design-system';

const meta = { title: 'Overlays/More overlays' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function PopupDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Popup
      isOpen={open}
      onClose={() => setOpen(false)}
      label="Filters"
      trigger={
        <Button onPress={() => setOpen(!open)} isSelected={open}>
          Filters
        </Button>
      }
      content={
        <div style={{ padding: 16, display: 'grid', gap: 8, width: 240 }}>
          <Checkbox label="Assigned to me" defaultChecked />
          <Checkbox label="Unresolved" />
          <Checkbox label="Has attachments" />
          <Button appearance="primary" onPress={() => setOpen(false)}>
            Apply
          </Button>
        </div>
      }
    />
  );
}

export const Popups: Story = { render: () => <PopupDemo /> };

function InlineDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Inline space="100" alignBlock="center">
      <Text>Username</Text>
      <InlineDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        label="About usernames"
        content="Usernames are unique, 3–20 characters, and can include letters, numbers and dashes."
      >
        <IconButton
          icon="info"
          label="About usernames"
          appearance="subtle"
          spacing="compact"
          onPress={() => setOpen(!open)}
        />
      </InlineDialog>
    </Inline>
  );
}

export const InlineDialogs: Story = { render: () => <InlineDialogDemo /> };

export const Tooltips: Story = {
  render: () => (
    <Inline space="200" style={{ paddingTop: 40 }}>
      <Tooltip content="Copy link to this issue">
        <IconButton icon="add" label="Copy link" />
      </Tooltip>
      <Tooltip content="Saved drafts appear in your profile" position="bottom">
        <Button>Save draft</Button>
      </Tooltip>
      <Tooltip content="A very long tooltip wraps onto several lines instead of running off the screen edge.">
        <Button appearance="subtle">Long tooltip</Button>
      </Tooltip>
    </Inline>
  ),
};

function DropdownDemo() {
  const [compact, setCompact] = useState(false);
  const [done, setDone] = useState(true);
  const [log, setLog] = useState('');
  return (
    <Stack space="200" alignInline="start">
      <Inline space="100">
        <DropdownMenu
          trigger="Actions"
          items={[
            { label: 'Edit', icon: 'add', onPress: () => setLog('Edit'), group: 'Issue' },
            {
              label: 'Move',
              description: 'To another project',
              onPress: () => setLog('Move'),
              group: 'Issue',
            },
            { label: 'Delete', isDisabled: true, group: 'Danger zone' },
          ]}
        />
        <DropdownMenu
          trigger={{ icon: 'chevron-down', label: 'View options' }}
          appearance="subtle"
          items={[
            {
              label: 'Compact rows',
              isChecked: compact,
              onCheckedChange: setCompact,
              group: 'Display',
            },
            { label: 'Show done', isChecked: done, onCheckedChange: setDone, group: 'Display' },
          ]}
        />
      </Inline>
      <Text size="small" color="color.text.subtle">
        {log
          ? `Chose: ${log}`
          : `Compact: ${compact ? 'on' : 'off'}, show done: ${done ? 'on' : 'off'}`}
      </Text>
    </Stack>
  );
}

export const DropdownMenus: Story = { render: () => <DropdownDemo /> };

function DrawerDemo() {
  const [open, setOpen] = useState<null | 'left' | 'right'>(null);
  return (
    <Inline space="100">
      <Button onPress={() => setOpen('left')}>Open drawer</Button>
      <Button onPress={() => setOpen('right')}>From the right</Button>
      <Drawer
        isOpen={open !== null}
        onClose={() => setOpen(null)}
        placement={open ?? 'left'}
        title="Create issue"
        width="medium"
      >
        <Stack space="200">
          <TextField label="Summary" isRequired />
          <TextField label="Assignee" />
          <Button appearance="primary" onPress={() => setOpen(null)}>
            Create
          </Button>
        </Stack>
      </Drawer>
    </Inline>
  );
}

export const Drawers: Story = { render: () => <DrawerDemo /> };
