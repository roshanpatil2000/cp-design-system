import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Checkbox, Modal, TextField, type ModalProps } from 'cp-design-system';

const meta = {
  title: 'Components/Modal dialog',
  component: Modal,
  args: { title: 'Invite teammates', isOpen: false, onClose: () => {} },
  argTypes: {
    width: { control: 'inline-radio', options: ['small', 'medium', 'large', 'x-large'] },
    appearance: { control: 'inline-radio', options: [undefined, 'warning', 'danger'] },
    isOpen: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo(props: Partial<ModalProps> & { label?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button
        appearance={props.appearance === 'danger' ? 'danger' : 'primary'}
        onPress={() => setOpen(true)}
      >
        {props.label ?? 'Open modal'}
      </Button>
      <Modal
        title="Invite teammates"
        footer={
          <>
            <Button appearance="subtle" onPress={close}>
              Cancel
            </Button>
            <Button
              appearance={props.appearance === 'danger' ? 'danger' : 'primary'}
              onPress={close}
            >
              {props.appearance === 'danger' ? 'Delete' : 'Send invites'}
            </Button>
          </>
        }
        {...props}
        isOpen={open}
        onClose={close}
      >
        {props.children ?? (
          <div style={{ display: 'grid', gap: 12 }}>
            <TextField label="Email addresses" placeholder="name@company.com" />
            <Checkbox label="Send a welcome email" defaultChecked />
          </div>
        )}
      </Modal>
    </>
  );
}

export const Playground: Story = { render: (args) => <Demo {...args} /> };

export const Danger: Story = {
  render: () => (
    <Demo label="Delete project…" appearance="danger" width="small" title="Delete this project?">
      The project and its 24 issues will be removed for everyone. This can’t be undone.
    </Demo>
  ),
};

export const LongContent: Story = {
  name: 'Scrolling body',
  render: () => (
    <Demo label="Open terms" title="Terms of service" width="large">
      {Array.from({ length: 30 }, (_, i) => (
        <p key={i}>
          {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
      ))}
    </Demo>
  ),
};
