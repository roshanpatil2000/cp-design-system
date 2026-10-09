import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ThemeProvider, createTheme, type ButtonAppearance } from 'cp-design-system';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Create issue' },
  argTypes: {
    appearance: {
      control: 'select',
      options: ['default', 'primary', 'subtle', 'warning', 'danger', 'discovery'],
    },
    spacing: { control: 'inline-radio', options: ['default', 'compact'] },
    motion: { control: 'select', options: [undefined, 'snappy', 'gentle', 'bouncy', false] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const appearances: ButtonAppearance[] = [
  'default',
  'primary',
  'subtle',
  'warning',
  'danger',
  'discovery',
];

function Row({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      {children}
    </div>
  );
}

/** A tiny inline icon that takes the button's current color and size. */
const plus = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
    <path d="M8 3v10M3 8h10" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);
const chevron = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
    <path d="M4 6l4 4 4-4" stroke={color} strokeWidth="1.75" fill="none" strokeLinecap="round" />
  </svg>
);

export const Playground: Story = {};

export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Row>
        {appearances.map((a) => (
          <Button key={a} appearance={a}>
            {a[0]!.toUpperCase() + a.slice(1)}
          </Button>
        ))}
      </Row>
      <Row>
        {appearances.map((a) => (
          <Button key={a} appearance={a} spacing="compact">
            Compact
          </Button>
        ))}
      </Row>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Row>
        <Button appearance="primary" isDisabled>
          Disabled
        </Button>
        <Button isDisabled>Disabled</Button>
        <Button appearance="primary" isLoading>
          Loading
        </Button>
        <Button isLoading>Loading</Button>
      </Row>
      <Row>
        <Button isSelected>Selected</Button>
        <Button appearance="subtle" isSelected>
          Selected subtle
        </Button>
      </Row>
    </div>
  ),
};

export const Icons: Story = {
  render: () => (
    <Row>
      <Button appearance="primary" iconBefore={plus}>
        Create
      </Button>
      <Button iconAfter={chevron}>Options</Button>
      <Button appearance="danger" iconBefore={plus} isDisabled>
        Disabled icon
      </Button>
    </Row>
  ),
};

function AsyncSave() {
  const [saving, setSaving] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <Row>
      <Button
        appearance="primary"
        isLoading={saving}
        onPress={() => {
          setSaving(true);
          setTimeout(() => {
            setSaving(false);
            setCount((c) => c + 1);
          }, 1200);
        }}
      >
        Save changes
      </Button>
      <span style={{ fontSize: 13 }}>
        Saved {count} time(s). The button keeps its width while loading.
      </span>
    </Row>
  );
}

export const AsyncLoading: Story = {
  name: 'Loading without layout shift',
  render: () => <AsyncSave />,
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: 320, display: 'grid', gap: 8 }}>
      <Button appearance="primary" shouldFitContainer>
        Continue
      </Button>
      <Button shouldFitContainer>Back</Button>
    </div>
  ),
};

const pill = createTheme({
  brand: '#0E9F6E',
  components: {
    Button: {
      defaultProps: { appearance: 'primary' },
      tokens: { radius: 999, height: 40, paddingX: 20, fontWeight: 600, pressScale: 0.92 },
      motion: 'bouncy',
    },
  },
});

export const BrandCustomized: Story = {
  name: 'Fully customized (theme-level)',
  render: () => (
    <ThemeProvider theme={pill}>
      <Row>
        <Button iconBefore={plus}>New project</Button>
        <Button appearance="default">Cancel</Button>
        <Button tokens={{ radius: 6 }}>Instance override</Button>
      </Row>
    </ThemeProvider>
  ),
};
