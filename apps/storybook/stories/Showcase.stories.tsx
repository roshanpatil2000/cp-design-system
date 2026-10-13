import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AvatarGroup,
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  Heading,
  Inline,
  Lozenge,
  ProgressBar,
  Select,
  SplitButton,
  Stack,
  Tabs,
  TextField,
  ThemeProvider,
  Toggle,
  createTheme,
  useTheme,
} from 'cp-design-system';

// Web twin of apps/expo-example/Showcase.tsx, used for the README's side-by-side screenshot.
const violet = createTheme({ brand: '#7C3AED' });

const team = [
  'Ada Lovelace',
  'Grace Hopper',
  'Alan Turing',
  'Margaret Hamilton',
  'Linus Torvalds',
].map((name) => ({ name }));

function ProjectSettings() {
  const theme = useTheme();
  const [visibility, setVisibility] = useState<string | null>('team');
  const text = { color: theme.color['color.text'], fontSize: 14, lineHeight: '20px' };
  return (
    <div
      style={{
        maxWidth: 420,
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <Stack space="200">
        <Breadcrumbs
          items={[{ label: 'Projects', href: '#projects' }, { label: 'Design system' }]}
        />
        <Inline space="100" alignBlock="center">
          <Heading size="large" as="h1">
            Design system
          </Heading>
          <Lozenge appearance="inprogress">In progress</Lozenge>
        </Inline>
        <Inline space="100" alignBlock="center">
          <AvatarGroup data={team} size="small" maxCount={4} />
          <span style={{ color: theme.color['color.text.subtle'], fontSize: 14 }}>5 members</span>
          <Badge appearance="primary">{12}</Badge>
        </Inline>
        <Tabs
          defaultSelected="settings"
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'settings', label: 'Settings' },
            { id: 'members', label: 'Members' },
          ]}
        />
        <TextField label="Project name" defaultValue="cp-design-system" />
        <Select
          label="Visibility"
          value={visibility}
          onChange={setVisibility}
          options={[
            { value: 'private', label: 'Private' },
            { value: 'team', label: 'Team' },
            { value: 'public', label: 'Public' },
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={text}>Email updates</span>
          <Toggle label="Email updates" size="large" appearance="brand" defaultChecked />
        </div>
        <Checkbox label="Notify me when I'm mentioned" defaultChecked />
        <Stack space="075">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={text}>Sprint progress</span>
            <span style={{ ...text, color: theme.color['color.text.subtle'] }}>68%</span>
          </div>
          <ProgressBar value={0.68} appearance="brand" label="Sprint progress" />
        </Stack>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: theme.space['100'],
            marginTop: theme.space['100'],
          }}
        >
          <Button appearance="subtle">Cancel</Button>
          <SplitButton appearance="primary" items={[{ label: 'Save as draft', onPress: () => {} }]}>
            Save
          </SplitButton>
        </div>
      </Stack>
    </div>
  );
}

const meta = { title: 'Showcase/Settings' } satisfies Meta;
export default meta;

export const Settings: StoryObj<typeof meta> = {
  render: () => (
    <ThemeProvider theme={violet}>
      <ProjectSettings />
    </ThemeProvider>
  ),
};
