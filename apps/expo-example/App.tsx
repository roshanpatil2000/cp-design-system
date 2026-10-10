import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StatusBar as RNStatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import {
  Button,
  TextField,
  ThemeProvider,
  Toggle,
  atlassianTheme,
  createTheme,
  fontWeightFor,
  resolveSpring,
  useHaptics,
  useReducedMotion,
  useTheme,
  type HapticsAdapter,
  type SpringName,
  type ThemeColor,
  type ThemePair,
} from 'cp-design-system';
import { Showcase } from './Showcase';

const brands: Record<string, ThemePair> = {
  Atlassian: atlassianTheme,
  Violet: createTheme({ brand: '#7C3AED' }),
  Crimson: createTheme({ brand: '#E5484D' }),
  Emerald: createTheme({ brand: '#0E9F6E' }),
  Amber: createTheme({ brand: '#F5B800' }),
};

const haptics: HapticsAdapter = (event) => {
  if (event === 'selection') Haptics.selectionAsync();
  else if (event === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const swatches: ThemeColor[] = [
  'color.background.brand.bold',
  'color.background.brand.bold.hovered',
  'color.background.brand.subtlest',
  'color.border.focused',
  'color.text.brand',
  'color.background.success.bold',
  'color.background.warning.bold',
  'color.background.danger.bold',
];

function Heading({ children }: { children: string }) {
  const theme = useTheme();
  const style = theme.text['heading.small'];
  return (
    <Text
      style={{
        color: theme.color['color.text'],
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        fontWeight: fontWeightFor(style.fontWeight),
        marginBottom: theme.space['100'],
      }}
    >
      {children}
    </Text>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ color: theme.color['color.text'], fontSize: theme.text.body.fontSize }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

/** Controlled toggle that "saves" for a moment, showing the loading pulse. */
/** Email field that validates on submit: shakes and shows an animated error. */
function EmailField() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <TextField
      testID="email"
      label="Work email"
      isRequired
      type="email"
      placeholder="you@company.com"
      value={email}
      onChange={(v) => {
        setEmail(v);
        setSubmitted(false);
      }}
      onSubmit={() => setSubmitted(true)}
      helperMessage="Press return to validate"
      isInvalid={invalid}
      errorMessage={email ? 'That doesn’t look like an email address' : 'Email is required'}
      validMessage={submitted && !invalid ? 'Looks good' : undefined}
    />
  );
}

/** Full-width primary button that "saves" for a moment, showing the loading crossfade. */
function AsyncSaveButton() {
  const [saving, setSaving] = useState(false);
  const [count, setCount] = useState(0);
  const theme = useTheme();
  return (
    <View style={{ gap: theme.space['075'] }}>
      <Button
        appearance="primary"
        shouldFitContainer
        isLoading={saving}
        testID="save"
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
      <Text style={{ color: theme.color['color.text.subtle'], fontSize: 12 }}>
        {`Saved ${count} time(s)`}
      </Text>
    </View>
  );
}

function AsyncToggleRow() {
  const [on, setOn] = useState(false);
  const [saving, setSaving] = useState(false);
  return (
    <SettingRow label={saving ? 'Saving…' : `Sync: ${on ? 'on' : 'off'}`}>
      <Toggle
        label="Sync"
        size="large"
        isChecked={on}
        isLoading={saving}
        onChange={(next) => {
          setSaving(true);
          setTimeout(() => {
            setOn(next);
            setSaving(false);
          }, 1200);
        }}
      />
    </SettingRow>
  );
}

function SpringRow({ name, on }: { name: SpringName; on: boolean }) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const x = useSharedValue(0);
  useEffect(() => {
    const spring = resolveSpring(theme, reduced, name);
    x.value = spring ? withSpring(on ? 240 : 0, spring) : on ? 240 : 0;
  }, [on, name, reduced, theme, x]);
  const dot = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <Text style={{ width: 64, color: theme.color['color.text.subtle'], fontSize: 12 }}>
        {name}
      </Text>
      <View
        style={{
          width: 272,
          height: 32,
          borderRadius: theme.radius.full,
          backgroundColor: theme.color['color.background.neutral'],
        }}
      >
        <Animated.View
          style={[
            {
              width: 32,
              height: 32,
              borderRadius: theme.radius.full,
              backgroundColor: theme.color['color.background.brand.bold'],
            },
            dot,
          ]}
        />
      </View>
    </View>
  );
}

function Foundations({
  brand,
  setBrand,
  dark,
  setDark,
  reduced,
  setReduced,
  openShowcase,
}: {
  brand: string;
  setBrand: (b: string) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
  reduced: boolean;
  setReduced: (v: boolean) => void;
  openShowcase: () => void;
}) {
  const theme = useTheme();
  const emit = useHaptics();
  const [on, setOn] = useState(false);
  const text = { color: theme.color['color.text'] };

  return (
    <ScrollView contentContainerStyle={{ padding: theme.space['250'], gap: theme.space['300'] }}>
      <Text
        style={{
          ...text,
          fontSize: theme.text['heading.large'].fontSize,
          lineHeight: theme.text['heading.large'].lineHeight,
          fontWeight: fontWeightFor(theme.text['heading.large'].fontWeight),
        }}
      >
        cp-design-system
      </Text>
      <Pressable onPress={openShowcase} accessibilityRole="button" testID="open-showcase">
        <Text style={{ color: theme.color['color.link'], fontSize: theme.text.body.fontSize }}>
          Open showcase ›
        </Text>
      </Pressable>

      <View>
        <Heading>Brand</Heading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space['100'] }}>
          {Object.keys(brands).map((name) => {
            const selected = name === brand;
            return (
              <Pressable
                key={name}
                onPress={() => {
                  emit('selection');
                  setBrand(name);
                }}
                style={{
                  paddingHorizontal: theme.space['150'],
                  paddingVertical: theme.space['075'],
                  borderRadius: theme.radius.full,
                  backgroundColor: selected
                    ? theme.color['color.background.brand.bold']
                    : theme.color['color.background.neutral'],
                }}
              >
                <Text
                  style={{
                    color: selected ? theme.color['color.text.onBrand'] : theme.color['color.text'],
                    fontWeight: '600',
                  }}
                >
                  {name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: theme.space['150'] }}>
        <SettingRow label="Dark mode">
          <Toggle
            label="Dark mode"
            size="large"
            appearance="brand"
            isChecked={dark}
            onChange={setDark}
            testID="dark-mode"
          />
        </SettingRow>
        <SettingRow label="Reduce motion">
          <Toggle
            label="Reduce motion"
            size="large"
            appearance="brand"
            isChecked={reduced}
            onChange={setReduced}
            testID="reduce-motion"
          />
        </SettingRow>
      </View>

      <View style={{ gap: theme.space['150'] }}>
        <Heading>Text field</Heading>
        <EmailField />
        <TextField label="Password" type="password" placeholder="At least 8 characters" />
        <TextField label="Bio" maxCharacters={40} defaultValue="Building a design system" />
        <TextField label="Disabled" isDisabled defaultValue="Can't edit me" isCompact />
      </View>

      <View style={{ gap: theme.space['150'] }}>
        <Heading>Button</Heading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space['100'] }}>
          <Button>Default</Button>
          <Button appearance="primary">Primary</Button>
          <Button appearance="subtle">Subtle</Button>
          <Button appearance="warning">Warning</Button>
          <Button appearance="danger">Danger</Button>
          <Button appearance="discovery">Discovery</Button>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space['100'] }}>
          <Button spacing="compact">Compact</Button>
          <Button isSelected>Selected</Button>
          <Button appearance="primary" isDisabled>
            Disabled
          </Button>
        </View>
        <AsyncSaveButton />
      </View>

      <View style={{ gap: theme.space['150'] }}>
        <Heading>Toggle</Heading>
        <SettingRow label="Regular · success">
          <Toggle label="Regular success" defaultChecked />
        </SettingRow>
        <SettingRow label="Large · brand">
          <Toggle label="Large brand" size="large" appearance="brand" />
        </SettingRow>
        <SettingRow label="Bouncy spring (drag me)">
          <Toggle label="Bouncy" size="large" motion="bouncy" testID="bouncy" />
        </SettingRow>
        <SettingRow label="Disabled">
          <Toggle label="Disabled" isDisabled defaultChecked />
        </SettingRow>
        <AsyncToggleRow />
      </View>

      <View>
        <Heading>Semantic colors</Heading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space['100'] }}>
          {swatches.map((token) => (
            <View key={token} style={{ width: 76 }}>
              <View
                style={{
                  height: 40,
                  borderRadius: theme.radius.medium,
                  backgroundColor: theme.color[token],
                  borderWidth: 1,
                  borderColor: theme.color['color.border'],
                }}
              />
              <Text style={{ fontSize: 10, color: theme.color['color.text.subtle'] }}>
                {token.replace('color.background.', '').replace('color.', '')}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View>
        <Heading>Springs (Reanimated)</Heading>
        <Pressable
          onPress={() => {
            emit('impactLight');
            setOn((v) => !v);
          }}
          style={{
            alignSelf: 'flex-start',
            marginBottom: theme.space['150'],
            paddingHorizontal: theme.space['150'],
            paddingVertical: theme.space['075'],
            borderRadius: theme.radius.medium,
            backgroundColor: theme.color['color.background.brand.bold'],
          }}
        >
          <Text style={{ color: theme.color['color.text.onBrand'], fontWeight: '600' }}>
            Animate
          </Text>
        </Pressable>
        {(Object.keys(theme.motion.springs) as SpringName[]).map((name) => (
          <SpringRow key={name} name={name} on={on} />
        ))}
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [brand, setBrand] = useState('Atlassian');
  const [dark, setDark] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [showcase, setShowcase] = useState(false);
  const pair = brands[brand] ?? atlassianTheme;
  const surface = pair[dark ? 'dark' : 'light'].color['elevation.surface'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        theme={pair}
        colorMode={dark ? 'dark' : 'light'}
        motion={reduced ? 'reduced' : 'system'}
        haptics={haptics}
      >
        <StatusBar style={dark ? 'light' : 'dark'} />
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: surface,
            // SafeAreaView only pads on iOS; leave room for the Android status bar too.
            paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
          }}
        >
          {showcase ? (
            <Showcase onBack={() => setShowcase(false)} />
          ) : (
            <Foundations
              brand={brand}
              setBrand={setBrand}
              dark={dark}
              setDark={setDark}
              reduced={reduced}
              setReduced={setReduced}
              openShowcase={() => setShowcase(true)}
            />
          )}
        </SafeAreaView>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
