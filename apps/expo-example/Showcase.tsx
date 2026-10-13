import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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

// The same screen exists as a Storybook story (apps/storybook/stories/Showcase.stories.tsx),
// used for the README's side-by-side screenshot. Keep the two in sync.
const violet = createTheme({ brand: '#7C3AED' });

const team = [
  'Ada Lovelace',
  'Grace Hopper',
  'Alan Turing',
  'Margaret Hamilton',
  'Linus Torvalds',
].map((name) => ({ name }));

function ProjectSettings({ onBack }: { onBack: () => void }) {
  const theme = useTheme();
  const [visibility, setVisibility] = useState<string | null>('team');
  const text = { color: theme.color['color.text'], fontSize: 14, lineHeight: 20 };
  return (
    <View style={{ padding: theme.space['300'] }}>
      <Pressable onPress={onBack} accessibilityRole="button">
        <Text style={{ color: theme.color['color.link'], marginBottom: theme.space['150'] }}>
          ‹ Back
        </Text>
      </Pressable>
      <Stack space="200">
        <Breadcrumbs
          items={[{ label: 'Projects', onPress: () => {} }, { label: 'Design system' }]}
        />
        <Inline space="100" alignBlock="center">
          <Heading size="large">Design system</Heading>
          <Lozenge appearance="inprogress">In progress</Lozenge>
        </Inline>
        <Inline space="100" alignBlock="center">
          <AvatarGroup data={team} size="small" maxCount={4} />
          <Text style={{ color: theme.color['color.text.subtle'], fontSize: 14 }}>5 members</Text>
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
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={text}>Email updates</Text>
          <Toggle label="Email updates" size="large" appearance="brand" defaultChecked />
        </View>
        <Checkbox label="Notify me when I'm mentioned" defaultChecked />
        <Stack space="075">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={text}>Sprint progress</Text>
            <Text style={{ ...text, color: theme.color['color.text.subtle'] }}>68%</Text>
          </View>
          <ProgressBar value={0.68} appearance="brand" label="Sprint progress" />
        </Stack>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: theme.space['100'],
            marginTop: theme.space['100'],
          }}
        >
          <Button appearance="subtle">Cancel</Button>
          <SplitButton appearance="primary" items={[{ label: 'Save as draft', onPress: () => {} }]}>
            Save
          </SplitButton>
        </View>
      </Stack>
    </View>
  );
}

export function Showcase({ onBack }: { onBack: () => void }) {
  return (
    <ThemeProvider theme={violet}>
      <ProjectSettings onBack={onBack} />
    </ThemeProvider>
  );
}
