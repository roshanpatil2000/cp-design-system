import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider, Toggle, createTheme, useTheme, type ToggleProps } from 'cp-design-system';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: { label: 'Allow notifications' },
  argTypes: {
    size: { control: 'inline-radio', options: ['regular', 'large'] },
    appearance: { control: 'inline-radio', options: ['success', 'brand'] },
    motion: { control: 'select', options: [undefined, 'snappy', 'gentle', 'bouncy', false] },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({ children, label }: { children: ReactNode; label: string }) {
  const theme = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 32 }}>
      {children}
      <span style={{ fontSize: 14, color: theme.color['color.text'] }}>{label}</span>
    </div>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', gap: 12 }}>{children}</div>;
}

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Grid>
      <Row label="Off">
        <Toggle label="Off" />
      </Row>
      <Row label="On">
        <Toggle label="On" defaultChecked />
      </Row>
      <Row label="Disabled, off">
        <Toggle label="Disabled off" isDisabled />
      </Row>
      <Row label="Disabled, on">
        <Toggle label="Disabled on" isDisabled defaultChecked />
      </Row>
      <Row label="Loading">
        <Toggle label="Loading" isLoading defaultChecked />
      </Row>
      <Row label="Large">
        <Toggle label="Large" size="large" defaultChecked />
      </Row>
    </Grid>
  ),
};

export const Appearance: Story = {
  name: 'Success vs brand',
  render: () => (
    <Grid>
      <Row label='appearance="success" (Atlassian green)'>
        <Toggle label="Success" defaultChecked size="large" />
      </Row>
      <Row label='appearance="brand" (follows the Brand toolbar)'>
        <Toggle label="Brand" appearance="brand" defaultChecked size="large" />
      </Row>
    </Grid>
  ),
};

export const Motion: Story = {
  name: 'Motion presets',
  render: () => (
    <Grid>
      {(['snappy', 'gentle', 'bouncy'] as const).map((name) => (
        <Row key={name} label={`motion="${name}"  (press and hold to see the squish, or drag)`}>
          <Toggle label={name} size="large" motion={name} />
        </Row>
      ))}
      <Row label="motion={false}  (instant)">
        <Toggle label="instant" size="large" motion={false} />
      </Row>
    </Grid>
  ),
};

function ControlledExample(props: Partial<ToggleProps>) {
  const [on, setOn] = useState(false);
  const [saving, setSaving] = useState(false);
  return (
    <Grid>
      <Row label={`Dark mode: ${on ? 'on' : 'off'}${saving ? ' (saving…)' : ''}`}>
        <Toggle
          label="Dark mode"
          size="large"
          {...props}
          isChecked={on}
          isLoading={saving}
          onChange={(next) => {
            setSaving(true);
            setTimeout(() => {
              setOn(next);
              setSaving(false);
            }, 900);
          }}
        />
      </Row>
    </Grid>
  );
}

export const ControlledAsync: Story = {
  name: 'Controlled with async save',
  render: () => <ControlledExample />,
};

const custom = createTheme({
  brand: '#E5484D',
  components: {
    Toggle: {
      defaultProps: { appearance: 'brand', size: 'large' },
      tokens: (theme) => ({
        width: 48,
        height: 26,
        thumbSize: 20,
        thumbInset: 3,
        thumbStretch: 8,
        iconSize: 13,
        trackOff: theme.color['color.background.neutral.subtle.pressed'],
        trackOffHovered: theme.color['color.background.neutral.subtle.hovered'],
        iconOff: theme.color['color.icon.subtle'],
      }),
      motion: 'bouncy',
    },
  },
});

export const BrandCustomized: Story = {
  name: 'Fully customized (theme-level)',
  render: () => (
    <ThemeProvider theme={custom}>
      <Grid>
        <Row label="Brand #E5484D, 48×26, bouncy spring, light off-track, big squish">
          <Toggle label="Custom" />
        </Row>
        <Row label="Same theme, instance override: tokens={{ thumbStretch: 0 }}">
          <Toggle label="No squish" defaultChecked tokens={{ thumbStretch: 0 }} />
        </Row>
      </Grid>
    </ThemeProvider>
  ),
};
