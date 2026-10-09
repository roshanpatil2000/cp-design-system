import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ThemeProvider, Toggle, createTheme, useTheme } from 'cp-design-system';

// Web twin of apps/expo-example/Showcase.tsx, used for the README's side-by-side screenshot.
const violet = createTheme({ brand: '#7C3AED' });

function Row({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${theme.space['150']}px 0`,
        borderBottom: `1px solid ${theme.color['color.border']}`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ color: theme.color['color.text'], fontSize: 16, fontWeight: 500 }}>
          {label}
        </span>
        <span style={{ color: theme.color['color.text.subtlest'], fontSize: 12 }}>{hint}</span>
      </div>
      {children}
    </div>
  );
}

function Showcase() {
  const theme = useTheme();
  const heading = theme.text['heading.large'];
  return (
    <div style={{ maxWidth: 420, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1
        style={{
          margin: 0,
          color: theme.color['color.text'],
          fontSize: heading.fontSize,
          lineHeight: `${heading.lineHeight}px`,
          fontWeight: heading.fontWeight,
        }}
      >
        Settings
      </h1>
      <p style={{ margin: `0 0 ${theme.space['200']}px`, color: theme.color['color.text.subtle'] }}>
        cp-design-system · Toggle · Button
      </p>
      <Row label="Wi-Fi" hint="On">
        <Toggle label="Wi-Fi" defaultChecked />
      </Row>
      <Row label="Bluetooth" hint="Off">
        <Toggle label="Bluetooth" />
      </Row>
      <ThemeProvider theme={violet}>
        <Row label="Dark mode" hint='Large · brand="#7C3AED"'>
          <Toggle label="Dark mode" size="large" appearance="brand" defaultChecked />
        </Row>
      </ThemeProvider>
      <Row label="Sync" hint="Loading">
        <Toggle label="Sync" defaultChecked isLoading motion={false} />
      </Row>
      <Row label="Airplane mode" hint="Disabled">
        <Toggle label="Airplane mode" isDisabled />
      </Row>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: theme.space['100'],
          marginTop: theme.space['300'],
        }}
      >
        <Button appearance="subtle">Cancel</Button>
        <Button appearance="primary">Save</Button>
      </div>
    </div>
  );
}

const meta = { title: 'Showcase/Settings' } satisfies Meta;
export default meta;

export const Settings: StoryObj<typeof meta> = { render: () => <Showcase /> };
