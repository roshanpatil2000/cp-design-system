import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, FlagProvider, useFlags, type FlagAppearance } from 'cp-design-system';

const meta = {
  title: 'Components/Flag',
  component: FlagProvider,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FlagProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const demos: { appearance: FlagAppearance; title: string; description: string }[] = [
  { appearance: 'normal', title: 'Connected to Slack', description: 'Updates will post to #team.' },
  { appearance: 'success', title: 'Changes saved', description: 'Everyone can see them now.' },
  { appearance: 'info', title: 'A new version is out', description: 'Reload to get it.' },
  { appearance: 'warning', title: 'Storage almost full', description: '4.5 of 5 GB used.' },
  { appearance: 'error', title: 'Upload failed', description: 'Check your connection.' },
];

function Launcher() {
  const { showFlag, dismissAllFlags } = useFlags();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 24 }}>
      {demos.map((d) => (
        <Button
          key={d.appearance}
          onPress={() =>
            showFlag({
              ...d,
              actions:
                d.appearance === 'error'
                  ? [
                      { content: 'Retry', onPress: () => {} },
                      { content: 'Details', onPress: () => {} },
                    ]
                  : [{ content: 'Undo', onPress: () => {} }],
            })
          }
        >
          Show {d.appearance}
        </Button>
      ))}
      <Button
        appearance="subtle"
        onPress={() =>
          showFlag({ title: 'Stays until dismissed', isAutoDismiss: false, icon: false })
        }
      >
        Persistent
      </Button>
      <Button appearance="subtle" onPress={dismissAllFlags}>
        Dismiss all
      </Button>
    </div>
  );
}

/** Hover a flag to pause its countdown; drag it sideways to dismiss. */
export const Playground: Story = {
  render: (args) => (
    <FlagProvider {...args}>
      <Launcher />
    </FlagProvider>
  ),
};

export const Quick: Story = {
  name: 'Short auto-dismiss (3s)',
  args: { autoDismissDuration: 3000 },
  render: Playground.render,
};
