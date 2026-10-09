import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ThemeProvider, Toggle, createTheme, fontWeightFor, useTheme } from 'cp-design-system';

// The same screen exists as a Storybook story (apps/storybook/stories/Showcase.stories.tsx),
// used for the README's side-by-side screenshot. Keep the two in sync.
const violet = createTheme({ brand: '#7C3AED' });

function Row({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.space['150'],
        borderBottomWidth: 1,
        borderBottomColor: theme.color['color.border'],
      }}
    >
      <View style={{ gap: 2 }}>
        <Text style={{ color: theme.color['color.text'], fontSize: 16, fontWeight: '500' }}>
          {label}
        </Text>
        <Text style={{ color: theme.color['color.text.subtlest'], fontSize: 12 }}>{hint}</Text>
      </View>
      {children}
    </View>
  );
}

export function Showcase({ onBack }: { onBack: () => void }) {
  const theme = useTheme();
  const heading = theme.text['heading.large'];
  return (
    <View style={{ padding: theme.space['300'] }}>
      <Pressable onPress={onBack} accessibilityRole="button">
        <Text style={{ color: theme.color['color.link'], marginBottom: theme.space['200'] }}>
          ‹ Back
        </Text>
      </Pressable>
      <Text
        style={{
          color: theme.color['color.text'],
          fontSize: heading.fontSize,
          lineHeight: heading.lineHeight,
          fontWeight: fontWeightFor(heading.fontWeight),
        }}
      >
        Settings
      </Text>
      <Text style={{ color: theme.color['color.text.subtle'], marginBottom: theme.space['200'] }}>
        cp-design-system · Toggle
      </Text>
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
    </View>
  );
}
