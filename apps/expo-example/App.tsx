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
  Avatar,
  AvatarGroup,
  Field,
  IconButton,
  LinkButton,
  Range,
  Select,
  SplitButton,
  TextArea,
  Badge,
  Banner,
  Box,
  Button,
  Checkbox,
  EmptyState,
  Heading as DSHeading,
  Icon,
  Inline,
  Lozenge,
  Pressable as DSPressable,
  ProgressBar,
  ProgressIndicator,
  SectionMessage,
  Skeleton,
  Spinner,
  Stack,
  Tag,
  Text as DSText,
  FlagProvider,
  Modal,
  RadioGroup,
  TextField,
  ThemeProvider,
  Toggle,
  atlassianTheme,
  createTheme,
  fontWeightFor,
  resolveSpring,
  useHaptics,
  useReducedMotion,
  useFlags,
  useTheme,
  type FlagAppearance,
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

/** Select-all checkbox that shows the mixed state while only some items are chosen. */
function ChecklistDemo() {
  const items = ['Email', 'Push', 'SMS'];
  const [chosen, setChosen] = useState<string[]>(['Email']);
  const all = chosen.length === items.length;
  return (
    <View>
      <Checkbox
        label="All notifications"
        testID="select-all"
        isChecked={all}
        isIndeterminate={chosen.length > 0 && !all}
        onChange={(on) => setChosen(on ? items : [])}
      />
      <View style={{ paddingLeft: 24 }}>
        {items.map((item) => (
          <Checkbox
            key={item}
            label={item}
            isChecked={chosen.includes(item)}
            onChange={(on) => setChosen((c) => (on ? [...c, item] : c.filter((x) => x !== item)))}
          />
        ))}
      </View>
    </View>
  );
}

const flagDemos: { appearance: FlagAppearance; title: string; description: string }[] = [
  { appearance: 'normal', title: 'Connected', description: 'Your Slack workspace is linked.' },
  { appearance: 'success', title: 'Changes saved', description: 'Everyone can see them now.' },
  { appearance: 'info', title: 'New version', description: 'Reload to get the latest.' },
  { appearance: 'warning', title: 'Storage almost full', description: '90% of 5 GB used.' },
  { appearance: 'error', title: 'Upload failed', description: 'Check your connection.' },
];

function FlagDemo() {
  const { showFlag } = useFlags();
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space['100'] }}>
      {flagDemos.map((f) => (
        <Button
          key={f.appearance}
          spacing="compact"
          testID={`flag-${f.appearance}`}
          onPress={() =>
            showFlag({
              ...f,
              actions: f.appearance === 'error' ? [{ content: 'Retry', onPress: () => {} }] : [],
            })
          }
        >
          {f.appearance}
        </Button>
      ))}
    </View>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState<null | 'default' | 'danger'>(null);
  const { showFlag } = useFlags();
  const theme = useTheme();
  const close = () => setOpen(null);
  return (
    <View style={{ flexDirection: 'row', gap: theme.space['100'] }}>
      <Button testID="open-modal" onPress={() => setOpen('default')}>
        Open modal
      </Button>
      <Button appearance="danger" onPress={() => setOpen('danger')}>
        Delete…
      </Button>
      <Modal
        isOpen={open !== null}
        onClose={close}
        testID="modal"
        appearance={open === 'danger' ? 'danger' : undefined}
        width={open === 'danger' ? 'small' : 'medium'}
        title={open === 'danger' ? 'Delete this project?' : 'Invite teammates'}
        footer={
          <>
            <Button appearance="subtle" onPress={close}>
              Cancel
            </Button>
            <Button
              appearance={open === 'danger' ? 'danger' : 'primary'}
              onPress={() => {
                close();
                showFlag({
                  appearance: 'success',
                  title: open === 'danger' ? 'Project deleted' : 'Invites sent',
                });
              }}
            >
              {open === 'danger' ? 'Delete' : 'Send invites'}
            </Button>
          </>
        }
      >
        {open === 'danger' ? (
          'The project and its 24 issues will be removed for everyone. This can’t be undone.'
        ) : (
          <View style={{ gap: theme.space['150'] }}>
            <TextField label="Email addresses" placeholder="name@company.com" />
            <Checkbox label="Send a welcome email" defaultChecked />
          </View>
        )}
      </Modal>
    </View>
  );
}

/** Actions, forms and people components from 0.5.0. */
function ActionsFormsPeopleDemo() {
  const { showFlag } = useFlags();
  const [plan, setPlan] = useState<string | null>(null);
  const [volume, setVolume] = useState(40);
  const team = [
    'Ada Lovelace',
    'Grace Hopper',
    'Alan Turing',
    'Margaret Hamilton',
    'Linus Torvalds',
    'Katherine Johnson',
    'Dennis Ritchie',
  ];
  return (
    <Stack space="300">
      <Stack space="150">
        <DSHeading size="small">Actions</DSHeading>
        <Inline space="100" alignBlock="center">
          <IconButton
            icon="add"
            label="Add"
            appearance="primary"
            testID="icon-add"
            onPress={() => showFlag({ title: 'Added', appearance: 'success' })}
          />
          <IconButton icon="cross" label="Close" />
          <IconButton icon="chevron-right" label="Next" shape="circle" />
          <IconButton icon="check" label="Done" appearance="subtle" />
        </Inline>
        <Inline space="100" alignBlock="center" shouldWrap>
          <SplitButton
            appearance="primary"
            testID="split"
            onPress={() => showFlag({ title: 'Published', appearance: 'success' })}
            items={[
              { label: 'Save as draft', onPress: () => showFlag({ title: 'Saved as draft' }) },
              {
                label: 'Schedule…',
                onPress: () => showFlag({ title: 'Scheduled', appearance: 'info' }),
              },
              { label: 'Delete', onPress: () => {}, isDisabled: true },
            ]}
          >
            Publish
          </SplitButton>
          <LinkButton href="https://atlassian.design">Atlassian Design</LinkButton>
        </Inline>
      </Stack>

      <Stack space="150">
        <DSHeading size="small">Forms</DSHeading>
        <Select
          label="Plan"
          testID="plan-select"
          isRequired
          value={plan}
          onChange={setPlan}
          isInvalid={!plan}
          errorMessage="Choose a plan"
          validMessage={plan ? 'Nice choice' : undefined}
          options={[
            { value: 'free', label: 'Free' },
            { value: 'standard', label: 'Standard' },
            { value: 'premium', label: 'Premium' },
            { value: 'enterprise', label: 'Enterprise', isDisabled: true },
          ]}
        />
        <TextArea label="About you" placeholder="A few words…" maxCharacters={120} testID="bio" />
        <Field label={`Volume: ${volume}%`}>
          <Range
            label="Volume"
            value={volume}
            onChange={setVolume}
            testID="volume"
            formatValue={(v) => `${v}%`}
          />
        </Field>
      </Stack>

      <Stack space="150">
        <DSHeading size="small">People</DSHeading>
        <Inline space="150" alignBlock="center">
          <Avatar name="Ada Lovelace" size="large" presence="online" />
          <Avatar name="Alan Turing" size="large" presence="busy" />
          <Avatar name="Design team" size="large" appearance="square" />
          <Avatar
            name="Grace Hopper"
            size="large"
            onPress={() => showFlag({ title: 'Grace Hopper' })}
          />
        </Inline>
        <AvatarGroup data={team.map((name) => ({ name }))} size="large" testID="team" />
      </Stack>
    </Stack>
  );
}

/** Building blocks and feedback components from 0.4.0. */
function FeedbackDemo() {
  const [progress, setProgress] = useState(0.3);
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(3);
  const [banner, setBanner] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [tags, setTags] = useState(['Design', 'Motion', 'Native']);
  return (
    <Stack space="300">
      <Stack space="150">
        <DSHeading size="small">Typography and layout</DSHeading>
        <DSText>
          Body text with a <DSText weight="bold">bold</DSText> word.
        </DSText>
        <Inline space="100" separator="·" alignBlock="center">
          <DSText size="small" color="color.text.subtle">
            Inline
          </DSText>
          <DSText size="small" color="color.text.subtle">
            with
          </DSText>
          <DSText size="small" color="color.text.subtle">
            separators
          </DSText>
        </Inline>
        <Inline space="150" alignBlock="center" shouldWrap>
          {(
            [
              'check',
              'cross',
              'add',
              'chevron-right',
              'info',
              'success',
              'warning',
              'error',
            ] as const
          ).map((g) => (
            <Icon key={g} glyph={g} size="large" />
          ))}
        </Inline>
        <DSPressable padding="150" onPress={() => setCount((c) => c + 1)} testID="pressable-card">
          <Inline space="100" alignBlock="center">
            <DSText weight="semibold">Pressable card (tap me)</DSText>
            <Badge appearance="primary">{count}</Badge>
          </Inline>
        </DSPressable>
      </Stack>

      <Stack space="150">
        <DSHeading size="small">Status</DSHeading>
        <Inline space="100" shouldWrap>
          <Lozenge appearance="inprogress">In progress</Lozenge>
          <Lozenge appearance="success" isBold>
            Done
          </Lozenge>
          <Lozenge appearance="removed">Blocked</Lozenge>
          <Badge appearance="important">{120}</Badge>
          <Badge appearance="added">{4}</Badge>
        </Inline>
        <Inline space="100" shouldWrap>
          {tags.map((t) => (
            <Tag
              key={t}
              text={t}
              color="blue"
              appearance="rounded"
              isRemovable
              onRemove={() => setTags((all) => all.filter((x) => x !== t))}
            />
          ))}
        </Inline>
      </Stack>

      <Stack space="150">
        <DSHeading size="small">Progress</DSHeading>
        <ProgressBar value={progress} label="Upload" testID="progress" />
        <ProgressBar isIndeterminate appearance="brand" />
        <Inline space="200" alignBlock="center">
          <Spinner size="small" />
          <Spinner />
          <ProgressIndicator
            count={5}
            selectedIndex={step}
            onSelect={setStep}
            appearance="primary"
          />
        </Inline>
        <Inline space="100">
          <Button
            spacing="compact"
            onPress={() => setProgress((v) => (v >= 1 ? 0 : Math.min(1, v + 0.2)))}
          >
            Advance
          </Button>
          <Button spacing="compact" onPress={() => setStep((v) => (v + 1) % 5)}>
            Next step
          </Button>
        </Inline>
      </Stack>

      <Stack space="150">
        <DSHeading size="small">Messages</DSHeading>
        <Box style={{ marginHorizontal: -20 }}>
          <Banner appearance="warning" isOpen={banner}>
            Your trial ends in 3 days.
          </Banner>
        </Box>
        <Button spacing="compact" onPress={() => setBanner((v) => !v)}>
          {banner ? 'Hide banner' : 'Show banner'}
        </Button>
        <SectionMessage
          appearance="error"
          title="Two fields need attention"
          actions={[{ content: 'Fix them', onPress: () => {} }]}
        >
          Check the email and password fields.
        </SectionMessage>
      </Stack>

      <Stack space="150">
        <DSHeading size="small">Loading</DSHeading>
        {loaded ? (
          <Inline space="150" alignBlock="center">
            <Box
              backgroundColor="color.background.brand.bold"
              borderRadius="full"
              style={{ width: 40, height: 40 }}
            />
            <Stack space="050">
              <DSText weight="semibold">Ada Lovelace</DSText>
              <DSText size="small" color="color.text.subtle">
                Updated the tokens
              </DSText>
            </Stack>
          </Inline>
        ) : (
          <Inline space="150" alignBlock="center">
            <Skeleton width={40} height={40} borderRadius="full" />
            <Stack space="100">
              <Skeleton width={140} height={14} />
              <Skeleton width={200} height={12} />
            </Stack>
          </Inline>
        )}
        <Button spacing="compact" onPress={() => setLoaded((v) => !v)}>
          {loaded ? 'Show skeleton' : 'Load content'}
        </Button>
        <EmptyState
          width="narrow"
          image={<Icon glyph="info" size={40} color="color.icon.subtle" />}
          header="No projects yet"
          description="Create one to get started."
          primaryAction={<Button appearance="primary">Create project</Button>}
        />
      </Stack>
    </Stack>
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
        <Heading>Actions, forms and people</Heading>
        <ActionsFormsPeopleDemo />
      </View>

      <View style={{ gap: theme.space['150'] }}>
        <Heading>Building blocks and feedback</Heading>
        <FeedbackDemo />
      </View>

      <View style={{ gap: theme.space['100'] }}>
        <Heading>Checkbox</Heading>
        <ChecklistDemo />
        <Checkbox label="I agree to the terms" isRequired isInvalid />
        <Checkbox label="Disabled" isDisabled defaultChecked />
      </View>

      <View style={{ gap: theme.space['100'] }}>
        <Heading>Radio group</Heading>
        <RadioGroup
          label="Plan"
          testID="plan"
          defaultValue="standard"
          options={[
            { value: 'free', label: 'Free' },
            { value: 'standard', label: 'Standard' },
            { value: 'premium', label: 'Premium' },
            { value: 'enterprise', label: 'Enterprise (contact sales)', isDisabled: true },
          ]}
        />
      </View>

      <View style={{ gap: theme.space['150'] }}>
        <Heading>Flag (swipe to dismiss)</Heading>
        <FlagDemo />
      </View>

      <View style={{ gap: theme.space['150'] }}>
        <Heading>Modal dialog</Heading>
        <ModalDemo />
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
        <FlagProvider>
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
        </FlagProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
