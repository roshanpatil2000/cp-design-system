# cp-design-system

[![npm version](https://img.shields.io/npm/v/cp-design-system)](https://www.npmjs.com/package/cp-design-system) [![npm downloads](https://img.shields.io/npm/dm/cp-design-system)](https://www.npmjs.com/package/cp-design-system) [![CI](https://github.com/roshanpatil2000/cp-design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/roshanpatil2000/cp-design-system/actions/workflows/ci.yml) [![types](https://img.shields.io/npm/types/cp-design-system)](https://www.npmjs.com/package/cp-design-system) [![license](https://img.shields.io/npm/l/cp-design-system)](https://github.com/roshanpatil2000/cp-design-system/blob/main/LICENSE)

**An animated UI component library for React (web) and React Native (iOS, Android, Expo), with one API on all three.** It has 41 accessible, brand-themable components built on [Atlassian's design tokens](https://atlassian.design/foundations/tokens/design-tokens), and supports dark mode, reduced motion and TypeScript.

**[Live demos and docs](https://roshanpatil2000.github.io/cp-design-system/)** · [GitHub](https://github.com/roshanpatil2000/cp-design-system) · [Changelog](https://github.com/roshanpatil2000/cp-design-system/blob/main/packages/cp-design-system/CHANGELOG.md)

![The same project settings screen, with breadcrumbs, avatars, tabs, a text field, a select, a toggle, a checkbox, a progress bar and a split button, rendered on the web, iOS and Android](https://raw.githubusercontent.com/roshanpatil2000/cp-design-system/main/docs/images/one-api-all-platforms.png)

```tsx
import { Button, Select, Tabs, TextField, Toggle, useFlags } from 'cp-design-system';

// Rendered inside <ThemeProvider> and <FlagProvider> (see below).
function Settings() {
  const { showFlag } = useFlags();
  return (
    <>
      <Tabs
        tabs={[
          { id: 'general', label: 'General' },
          { id: 'members', label: 'Members' },
        ]}
      />
      <TextField label="Project name" defaultValue="Apollo" />
      <Select
        label="Visibility"
        options={[
          { value: 'team', label: 'Team' },
          { value: 'public', label: 'Public' },
        ]}
      />
      <Toggle label="Email updates" defaultChecked />
      <Button
        appearance="primary"
        onPress={() => showFlag({ title: 'Saved', appearance: 'success' })}
      >
        Save
      </Button>
    </>
  );
}
```

The same code renders real DOM elements animated with Motion on the web, and native views animated on the UI thread with Reanimated and Gesture Handler on iOS and Android. Your bundler picks the right build automatically, and you don't need `react-native-web`.

## Why cp-design-system

- **One API, all platforms.** You write a screen once and it's native on web, iOS and Android, with identical props and behaviour.
- **Atlassian's design language.** It includes about 340 semantic colors (light and dark), plus spacing, radius, typography and motion, generated from `@atlaskit/tokens`. Atlaskit is not a runtime dependency.
- **Your brand.** One brand color re-themes every brand, selection, focus and link token in both modes, with WCAG contrast enforced. Every component can be restyled globally or per instance.
- **Motion built in.** Springs, gestures and micro-interactions (swipe-to-dismiss toasts, springy toggles, sliding tab indicators, a peeking carousel) respect the OS "reduce motion" setting.
- **Accessible.** It uses the right roles and states, keyboard support and focus management on web, and screen-reader labels and actions on native.
- **Tested.** Each component has web tests (Vitest) and native tests (Jest), and is checked in Storybook and on iOS and Android.

## Components

| Group           | Components                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Building blocks | [Box, Stack, Inline, Text, Heading, Icon, Pressable](#building-blocks)                                                                                       |
| Actions         | [Button](#button), [IconButton, LinkButton, SplitButton](#actions)                                                                                           |
| Forms           | [TextField](#text-field), [Checkbox](#checkbox), [RadioGroup](#radio-group), [Toggle](#toggle), [Select, TextArea, Range (slider), Field](#more-form-fields) |
| Feedback        | [Flag (toast)](#flag-toast), [Banner, SectionMessage, Spinner, ProgressBar, ProgressIndicator, Lozenge, Badge, Tag, Skeleton, EmptyState](#feedback)         |
| Overlays        | [Modal dialog](#modal-dialog), [Drawer (bottom sheet), Popup, InlineDialog, Tooltip, DropdownMenu](#more-overlays)                                           |
| Navigation      | [Tabs, Breadcrumbs, Pagination](#navigation)                                                                                                                 |
| Display         | [Carousel](#carousel), [Avatar, AvatarGroup](#people)                                                                                                        |

## Install

```bash
yarn add cp-design-system
```

**React Native / Expo** also needs the animation libraries, which you probably have already:

```bash
npx expo install react-native-reanimated react-native-worklets react-native-gesture-handler
```

Web apps need nothing extra. The web build never imports React Native.

## Set up the provider

```tsx
import { ThemeProvider, createTheme } from 'cp-design-system';

const theme = createTheme({ brand: '#7C3AED' });

export function App() {
  return (
    <ThemeProvider theme={theme} colorMode="system">
      {/* your app */}
    </ThemeProvider>
  );
}
```

| Prop        | Default    | What it does                                                                                       |
| ----------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `theme`     | Atlassian  | A pair from `createTheme()` or a single theme                                                      |
| `colorMode` | `'light'`  | `'light'`, `'dark'` or `'system'` (follows the OS or browser)                                      |
| `motion`    | `'system'` | `'system'` respects "reduce motion"; `'reduced'` makes all motion instant; `'full'` ignores the OS |
| `haptics`   | none       | Function called with events like `'selection'` (see below)                                         |

## Make it yours

Everything is optional. Start with just `brand`.

```ts
const theme = createTheme({
  // One color re-themes brand, selected, focus and link tokens in light and dark mode.
  // It becomes your exact primary color in light mode; dark mode gets a matching lighter shade.
  brand: '#7C3AED', // or { light: '#7C3AED', dark: '#C4B5FD' } to pin both

  // Override any of Atlassian's semantic tokens, for one or both modes.
  colors: { light: { 'color.border.focused': '#F97316' } },

  radius: { medium: 10, large: 14 },
  fontFamily: { body: 'Inter', heading: 'Inter' },
  text: { body: { fontSize: 15 } },

  // Tune the feel of every animation.
  motion: { springs: { snappy: { stiffness: 600, damping: 30, mass: 1 } } },

  // Per-component defaults and style tokens (available as components ship).
  components: {},
});
```

Light brand colors are handled for you. Text on the brand color switches to dark when needed, and brand text, links, icons and focus rings are darkened (or lightened in dark mode) until they meet WCAG contrast (4.5:1 for text, 3:1 for icons and borders).

### Haptics (native)

Components emit haptic events; you decide what they do. With Expo:

```tsx
import * as Haptics from 'expo-haptics';

<ThemeProvider
  haptics={(event) =>
    event === 'selection'
      ? Haptics.selectionAsync()
      : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }
/>;
```

### Read the theme in your own components

```tsx
import { useTheme, useReducedMotion } from 'cp-design-system';

const theme = useTheme();
theme.color['color.background.brand.bold'];
theme.space['200']; // 16
theme.radius.medium; // 6
theme.text['heading.small']; // { fontSize, lineHeight, fontWeight }
theme.motion.springs.snappy; // { stiffness, damping, mass }
```

On React Native, use `fontWeightFor(theme.text.body.fontWeight)`. React Native only accepts weights in steps of 100.

## Tokens only

The raw Atlassian tokens are available without React:

```ts
import { atlassianLightColors, atlassianSpace, atlassianEasings } from 'cp-design-system/tokens';
```

## Component reference

Each component is built and tested on both platforms (web, iOS and Android).

### Text field

Atlassian's text field (40px, or 32px with `isCompact`) with its form pieces built in: label, required asterisk, helper, error and valid messages, and a character counter.

- **Focus and states:** a 2px focus edge and a 2px danger edge when invalid. Border, background and ring fade over Atlassian's 150ms input timing, and the 2px edge never shifts the layout.
- **Messages:** they slide 2px and fade in, then fade out, with the space collapsing smoothly (Atlassian's form message motion). An error replaces the helper; a valid message shows when the field isn't invalid.
- **Shake:** the field shakes when it becomes invalid or when the error message changes. Reduced motion turns this off.
- **Character counter:** shows "N characters remaining", then "N characters too many" as an error. Typing past the limit is allowed, as in Atlassian. "N more characters needed" only becomes an error after the user leaves the field. Screen readers hear the count once typing settles.
- **Phones:** 16px text on touch phones so iOS doesn't zoom, at the same 40px height. `type` picks the right keyboard (email, number, phone, URL, search, password). On native, an uncontrolled field owns its text, so fast input is never overwritten.

```tsx
import { TextField } from 'cp-design-system';

<TextField label="Display name" defaultValue="Roshan" maxCharacters={30} />

<TextField
  label="Work email"
  type="email"
  isRequired
  value={email}
  onChange={setEmail}
  onSubmit={validate}
  helperMessage="We'll never share it"
  isInvalid={!!error}
  errorMessage={error}
/>
```

| Prop                                                                  | Default      |                                                                                             |
| --------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| `label` / `accessibilityLabel`                                        |              | Visible label, or an accessible name when there is none                                     |
| `value` / `defaultValue`                                              |              | Controlled or uncontrolled text                                                             |
| `onChange`                                                            |              | `(text: string) => void` on every change                                                    |
| `onSubmit`, `onFocus`, `onBlur`                                       |              | Enter on the web, the return key on native                                                  |
| `type`                                                                | `'text'`     | `'text'`, `'email'`, `'password'`, `'number'`, `'tel'`, `'url'` or `'search'`               |
| `appearance`                                                          | `'standard'` | `'standard'`, `'subtle'` (border on hover and focus) or `'none'`                            |
| `isCompact`, `isDisabled`, `isReadOnly`, `isRequired`, `isMonospaced` | `false`      |                                                                                             |
| `isInvalid` + `errorMessage`, `helperMessage`, `validMessage`         |              | Messages below the field                                                                    |
| `maxCharacters`, `minCharacters`                                      |              | Character counter                                                                           |
| `elemBeforeInput`, `elemAfterInput`                                   |              | Content inside the field, e.g. a search icon or a clear button                              |
| `width`                                                               | full width   | `'xsmall'` (80), `'small'` (160), `'medium'` (240), `'large'` (320), `'xlarge'` (480) or px |
| `name`, `autoComplete`, `autoFocus`, `placeholder`                    |              | `name` is web only                                                                          |
| `tokens`, `motion`                                                    |              | Style tokens, and the shake (`false` turns it off)                                          |

Tokens: `height`, `paddingX`, `radius`, `borderWidth`, `fontSize`, `lineHeight`, `fontFamily`, `monoFontFamily`, `background`, `backgroundHovered`, `backgroundFocused`, `backgroundDisabled`, `border`, `borderHovered`, `borderFocused`, `borderInvalid`, `borderDisabled`, `text`, `textDisabled`, `placeholder`, `placeholderDisabled`, `labelColor`, `labelFontSize`, `labelLineHeight`, `labelFontWeight`, `requiredColor`, `messageFontSize`, `messageLineHeight`, `helperColor`, `errorColor`, `validColor`, `shakeDistance`.

### Button

Atlassian's button (32px tall, or 24px with `spacing="compact"`) in six appearances, with motion on both platforms:

- **Press:** springs down to 96% while held. Hover and pressed colors fade over 150ms, using Atlassian's button timing. Space and Enter press it visibly on the web.
- **Loading:** the label fades out and a spinner fades in at the same size, so the layout never shifts. A loading button stays focusable but ignores presses and is announced as busy.
- **Native touch:** an `'impactLight'` haptic on press, and the touch area is enlarged to 44pt (compact buttons too).
- **Accessibility:** a native `<button>` on the web, with `aria-pressed` for `isSelected`; on native, the button role with disabled, busy and selected states.

```tsx
import { Button } from 'cp-design-system';

<Button appearance="primary" onPress={save}>Save</Button>
<Button appearance="subtle" spacing="compact">Cancel</Button>
<Button appearance="primary" isLoading={saving} shouldFitContainer>Save changes</Button>

// Icons receive the button's current color and size, so they always match
<Button iconBefore={({ color, size }) => <PlusIcon color={color} size={size} />}>Create</Button>
```

| Prop                                    | Default     |                                                                                |
| --------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `children`                              | (required)  | The label. Text is styled for you; other nodes render as they are              |
| `onPress`                               |             | Click, tap, Enter or Space. Not called while disabled or loading               |
| `appearance`                            | `'default'` | `'default'`, `'primary'`, `'subtle'`, `'warning'`, `'danger'` or `'discovery'` |
| `spacing`                               | `'default'` | `'default'` (32px) or `'compact'` (24px)                                       |
| `isDisabled`, `isLoading`, `isSelected` | `false`     | States; see above                                                              |
| `shouldFitContainer`                    | `false`     | Stretch to the container's width                                               |
| `iconBefore`, `iconAfter`               |             | An element, or `({ color, size }) => element`                                  |
| `motion`                                | `'snappy'`  | Press spring: `'snappy'`, `'gentle'`, `'bouncy'`, a custom spring, or `false`  |
| `tokens`                                |             | Override any style token for this instance                                     |
| `accessibilityLabel`, `type`, `testID`  |             | Accessible name; `type` (`'button'`, `'submit'` or `'reset'`) is web only      |

`appearance="primary"` follows your brand color, and the text switches to dark on light brands automatically.

**Make it yours:**

```ts
createTheme({
  brand: '#0E9F6E',
  components: {
    Button: {
      defaultProps: { appearance: 'primary' },
      tokens: { radius: 999, height: 40, paddingX: 20, pressScale: 0.92 },
      motion: 'bouncy',
    },
  },
});
```

Tokens: `height`, `paddingX`, `gap`, `radius`, `fontSize`, `lineHeight`, `fontWeight`, `fontFamily`, `background`, `backgroundHovered`, `backgroundPressed`, `text`, `border`, `borderWidth`, `backgroundDisabled`, `textDisabled`, `borderDisabled`, `iconSize`, `spinnerSize`, `pressScale`, `focusRing`, `focusRingWidth`, `focusRingGap`.

### Toggle

Atlassian's toggle (32×16, or 40×20 with `size="large"`), with motion on both platforms:

- **Thumb motion:** the thumb springs into place, squishes while pressed, and squashes against the edge instead of overshooting.
- **Track and icons:** the track color follows the thumb, and the check and cross icons fade and scale.
- **Drag to toggle:** drag past halfway or flick. On native this runs on the UI thread via Gesture Handler.
- **Native touch:** a `'selection'` haptic fires on change, and the touch area is enlarged to 44pt.
- **Accessibility:** web uses `role="switch"` with Space and Enter; native exposes the switch role and works with VoiceOver and TalkBack.

```tsx
import { Toggle } from 'cp-design-system';

// Uncontrolled
<Toggle label="Email notifications" defaultChecked onChange={(on) => save(on)} />

// Controlled, with a loading pulse while saving
<Toggle label="Sync" isChecked={sync} isLoading={saving} onChange={updateSync} />

// Your brand color instead of Atlassian green
<Toggle label="Dark mode" appearance="brand" size="large" />
```

| Prop                           | Default     |                                                                                      |
| ------------------------------ | ----------- | ------------------------------------------------------------------------------------ |
| `label`                        | (required)  | Accessible name. Render visible text next to it yourself                             |
| `isChecked` / `defaultChecked` | `false`     | Controlled or uncontrolled state                                                     |
| `onChange`                     |             | `(checked: boolean) => void`, fired for taps, clicks, drags, keys and screen readers |
| `size`                         | `'regular'` | `'regular'` (32×16) or `'large'` (40×20)                                             |
| `appearance`                   | `'success'` | `'success'` (Atlassian green) or `'brand'`                                           |
| `isDisabled`, `isLoading`      | `false`     | Both block input; loading pulses the thumb and sets busy                             |
| `motion`                       | `'snappy'`  | `'snappy'`, `'gentle'`, `'bouncy'`, a custom spring, or `false`                      |
| `tokens`                       |             | Override any style token for this instance (see below)                               |
| `name`, `value`                |             | Web forms: submits `value` (default `'on'`) when checked                             |

**Customize it for your brand.** Use the theme to change every Toggle, or `tokens` to change one:

```ts
createTheme({
  brand: '#E5484D',
  components: {
    Toggle: {
      defaultProps: { appearance: 'brand', size: 'large' },
      tokens: (theme) => ({ width: 48, height: 26, thumbSize: 20, thumbInset: 3, thumbStretch: 8 }),
      motion: 'bouncy',
    },
  },
});
```

Tokens: `width`, `height`, `thumbSize`, `thumbInset`, `thumbStretch`, `iconSize`, `trackOff`, `trackOffHovered`, `trackOn`, `trackOnHovered`, `trackDisabled`, `thumb`, `iconOn`, `iconOff`, `iconDisabled`, `focusRing`, `focusRingWidth`, `focusRingGap`.

### Checkbox

Atlassian's 14px checkbox in a 24px hit area. The box fills over 150ms and pops while pressed, and the tick springs in. It supports a mixed (indeterminate) state.

```tsx
import { Checkbox } from 'cp-design-system';

<Checkbox label="Remember me" defaultChecked onChange={(on) => setRemember(on)} />

// "Select all" with a mixed state
<Checkbox label="All" isChecked={all} isIndeterminate={some && !all} onChange={selectAll} />

<Checkbox label="I agree to the terms" isRequired isInvalid={!agreed} />
```

| Prop                                    | Default    |                                                          |
| --------------------------------------- | ---------- | -------------------------------------------------------- |
| `label`                                 | (required) | Visible label and accessible name                        |
| `isChecked` / `defaultChecked`          | `false`    | Controlled or uncontrolled state                         |
| `isIndeterminate`                       | `false`    | Shows a dash and reports `mixed`. Pressing it selects    |
| `onChange`                              |            | `(checked: boolean) => void`                             |
| `isDisabled`, `isInvalid`, `isRequired` | `false`    | Invalid shows a red border; required adds a red `*`      |
| `name`, `value`                         |            | Web forms: submits `value` (default `'on'`) when checked |
| `tokens`, `motion`                      |            | Per-instance overrides, as for every component           |

Tokens: `size`, `radius`, `borderWidth`, `hitSize`, `gap`, `pressedScale`, `background`, `backgroundHovered`, `backgroundPressed`, `border`, `borderInvalid`, `checked`, `checkedHovered`, `checkedPressed`, `mark`, `disabledBackground`, `disabledMark`, `label`, `labelDisabled`, `required`, `fontSize`, `lineHeight`, `fontFamily`, `focusRing`, `focusRingWidth`. Theme key: `components.Checkbox`.

### Radio group

A group of radios whose dot springs in when selected. On web it uses native radio inputs, so arrow keys move the selection and the value is submitted with forms. Use `Radio` on its own for custom layouts.

```tsx
import { RadioGroup } from 'cp-design-system';

<RadioGroup
  label="Plan"
  defaultValue="standard"
  onChange={(plan) => setPlan(plan)}
  options={[
    { value: 'free', label: 'Free' },
    { value: 'standard', label: 'Standard' },
    { value: 'enterprise', label: 'Enterprise', isDisabled: true },
  ]}
/>;
```

| Prop                                    | Default      |                                      |
| --------------------------------------- | ------------ | ------------------------------------ |
| `options`                               | (required)   | `{ value, label, isDisabled? }[]`    |
| `value` / `defaultValue`                |              | Controlled or uncontrolled selection |
| `onChange`                              |              | `(value: string) => void`            |
| `label`                                 |              | Accessible name of the group         |
| `direction`                             | `'vertical'` | `'vertical'` or `'horizontal'`       |
| `isDisabled`, `isInvalid`, `isRequired` | `false`      |                                      |
| `name`                                  | generated    | Web form field name                  |

Radio uses the Checkbox tokens plus `dotSize`. Theme keys: `components.Radio` (tokens) and `components.RadioGroup` (default props).

### Flag (toast)

Atlassian's flags: they stack in the bottom-left corner on web and at the bottom of the screen on native.

- **Motion:** flags slide in and out with Atlassian's flag timings, and the stack moves smoothly when one leaves.
- **Auto-dismiss:** after 8 seconds, shown by a countdown bar. The countdown pauses while the flag is hovered, focused or touched.
- **Swipe to dismiss:** swipe sideways. On native this runs on the UI thread.
- **Accessibility:** errors and warnings are announced as alerts.

```tsx
import { FlagProvider, useFlags } from 'cp-design-system';

// Once, near the root (inside ThemeProvider)
<FlagProvider>
  <App />
</FlagProvider>;

// Anywhere below it
const { showFlag, dismissFlag } = useFlags();
showFlag({
  appearance: 'error',
  title: 'Upload failed',
  description: 'Check your connection.',
  actions: [{ content: 'Retry', onPress: retry }],
});
```

| `showFlag` option | Default       |                                                             |
| ----------------- | ------------- | ----------------------------------------------------------- |
| `title`           | (required)    |                                                             |
| `description`     |               |                                                             |
| `appearance`      | `'normal'`    | `'normal'`, `'info'`, `'success'`, `'warning'` or `'error'` |
| `icon`            | by appearance | `'info'`, `'success'`, `'warning'`, `'error'` or `false`    |
| `actions`         |               | `{ content, onPress }[]`                                    |
| `isAutoDismiss`   | `true`        |                                                             |
| `id`              | generated     | Reuse an id to replace a visible flag                       |
| `onDismissed`     |               | Called once the flag is gone                                |

`FlagProvider` props: `autoDismissDuration` (default `8000`), `maxFlags` (default `5`), `label`, `tokens` and `motion`. The `useFlags()` hook also returns `dismissAllFlags`. Theme key: `components.Flag`.

### Modal dialog

Atlassian's modal: a blanket with a dialog that fades and slides in using Atlassian's modal timings. It has a header, a scrolling body and a right-aligned footer.

- **Web:** the dialog renders in a portal. It traps focus, closes on Escape or a blanket click, locks page scrolling and returns focus when it closes. Below 30rem it fills the screen.
- **Native:** the dialog uses a transparent RN `Modal`, and Android back closes it. On narrow screens a small dialog stays a centered card, and wider ones fill the screen.

```tsx
import { Button, Modal } from 'cp-design-system';

<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Delete this project?"
  appearance="danger"
  width="small"
  footer={
    <>
      <Button appearance="subtle" onPress={() => setOpen(false)}>
        Cancel
      </Button>
      <Button appearance="danger" onPress={remove}>
        Delete
      </Button>
    </>
  }
>
  The project and its issues will be removed for everyone.
</Modal>;
```

| Prop                         | Default    |                                                                            |
| ---------------------------- | ---------- | -------------------------------------------------------------------------- |
| `isOpen`, `onClose`, `title` | (required) |                                                                            |
| `footer`                     |            | Usually Buttons                                                            |
| `width`                      | `'medium'` | `'small'` 400, `'medium'` 600, `'large'` 800, `'x-large'` 968, or a number |
| `appearance`                 |            | `'warning'` or `'danger'` adds an icon before the title                    |
| `shouldCloseOnBlanketClick`  | `true`     |                                                                            |
| `shouldCloseOnEscapePress`   | `true`     | Web only                                                                   |
| `onCloseComplete`            |            | Called after the exit animation                                            |
| `tokens`, `motion`           |            | `motion={false}` turns the animation off                                   |

Theme key: `components.Modal`.

### Building blocks

Layout and typography primitives. Every value comes from theme tokens, so a brand change flows through your own screens too.

```tsx
import { Box, Heading, Icon, Inline, Pressable, Stack, Text } from 'cp-design-system';

<Box padding="200" backgroundColor="elevation.surface.raised" borderRadius="large">
  <Stack space="100">
    <Heading size="small">Weekly report</Heading>
    <Text color="color.text.subtle" maxLines={2}>
      Three projects shipped this week.
    </Text>
    <Inline space="100" separator="·" alignBlock="center">
      <Text size="small">Design</Text>
      <Text size="small">Engineering</Text>
    </Inline>
  </Stack>
</Box>

<Pressable padding="150" onPress={openProject}>
  {({ hovered }) => <Icon glyph="chevron-right" color={hovered ? 'color.icon.brand' : undefined} />}
</Pressable>
```

| Component   | What it does                                                                                                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Box`       | Padding (`padding`, `paddingX`, `paddingY`, sides), `backgroundColor`, `borderColor`, `borderWidth`, `borderRadius` from tokens; `as` picks the HTML element on web                                             |
| `Stack`     | A column with a token `space` gap; `alignInline`, `grow="fill"`                                                                                                                                                 |
| `Inline`    | A row with `space`, `rowSpace`, `alignBlock`, `alignInline`, `spread="space-between"`, `shouldWrap` and an optional `separator`                                                                                 |
| `Text`      | Body text: `size` small/medium/large, `weight` regular/medium/semibold/bold, a theme `color`, `align`, `maxLines`                                                                                               |
| `Heading`   | Atlassian heading scale from `xxlarge` to `xxsmall`. On web the `h1`–`h6` level follows the size unless you set `as`; on native it's a header for screen readers                                                |
| `Icon`      | Built-in glyphs (`check`, `cross`, `add`, `remove`, four chevrons, `info`, `success`, `warning`, `error`) drawn without SVG, so no extra native dependency. Decorative unless you pass `label`                  |
| `Pressable` | An unstyled button with the system's hover and pressed backgrounds, a spring squish and a keyboard focus ring. Children can be a function of `{ hovered, pressed, focused }`. Theme key: `components.Pressable` |

### Feedback

```tsx
import { Badge, Banner, EmptyState, Lozenge, ProgressBar, SectionMessage, Skeleton, Spinner, Tag } from 'cp-design-system';

<ProgressBar value={0.4} label="Uploading report" />
<Lozenge appearance="success" isBold>Done</Lozenge>
<Badge appearance="important">{unread}</Badge>
<Tag text="Design" color="purple" isRemovable onRemove={() => removeTag('Design')} />
<Banner appearance="error">We're having trouble connecting.</Banner>
<SectionMessage appearance="warning" title="Check your settings" actions={[{ content: 'Fix it', onPress: fix }]}>
  Two fields need attention.
</SectionMessage>
{loading ? <Skeleton width={160} height={14} /> : <Text>{name}</Text>}
```

| Component           | Highlights                                                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Spinner`           | Sizes `xsmall` 8 to `xlarge` 96, `appearance` inherit/invert, labelled "Loading" (or `label={false}`). Fades in; keeps spinning with reduced motion |
| `ProgressBar`       | Springs to new `value`s (0–1); `isIndeterminate` loops a segment. Appearances: default, brand, success, inverse                                     |
| `ProgressIndicator` | Step dots; the current one stretches into a pill. With `onSelect` the dots become tabs                                                              |
| `Lozenge`           | Status labels: default, inprogress, moved, new, removed, success; subtle or `isBold`                                                                |
| `Badge`             | Counts with `max` (default 99 → `99+`); pops when the value changes. Appearances: default, primary, primaryInverted, important, added, removed      |
| `Tag`               | Eleven colors, square or `rounded`; removable tags shrink away, then call `onRemove`                                                                |
| `Banner`            | Full-width warning, error or announcement; `isOpen` slides it in and out                                                                            |
| `SectionMessage`    | Information, warning, error, success or discovery messages with a title and link actions                                                            |
| `Skeleton`          | Placeholder shapes that pulse while loading (held still with reduced motion); hidden from assistive tech                                            |
| `EmptyState`        | Image, header, description and actions for empty screens; rises in on mount                                                                         |

Each one has a theme key under `components` (for example `components.Badge`) for default props, tokens and motion, plus per-instance `tokens` and `motion` props, as for every component.

### Actions

```tsx
import { IconButton, LinkButton, SplitButton } from 'cp-design-system';

<IconButton icon="cross" label="Close" onPress={close} />
<IconButton icon="add" label="New issue" appearance="primary" shape="circle" />

<LinkButton href="https://atlassian.design" target="_blank">Read the guidelines</LinkButton>

<SplitButton
  appearance="primary"
  onPress={publish}
  items={[
    { label: 'Save as draft', onPress: saveDraft },
    { label: 'Schedule…', onPress: schedule },
  ]}
>
  Publish
</SplitButton>
```

| Component     | Highlights                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `IconButton`  | Any built-in glyph or your own icon, with a required `label`. Square or `shape="circle"`, default 32px or compact 24px, all Button appearances |
| `LinkButton`  | Looks like a Button, works like a link: a real `<a href>` on web (new tab, crawlers), and opens the URL on native                              |
| `SplitButton` | A main action joined to a dropdown of related actions; the menu is keyboard driven on web (arrows, Enter, Escape, typeahead)                   |

### More form fields

```tsx
import { Field, Range, Select, TextArea } from 'cp-design-system';

<Select
  label="Plan"
  options={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
  ]}
  value={plan}
  onChange={setPlan}
  isInvalid={!plan}
  errorMessage="Choose a plan"
/>

<TextArea label="Description" maxCharacters={280} helperMessage="Grows as you type" />

<Field label={`Volume: ${volume}%`}>
  <Range label="Volume" value={volume} onChange={setVolume} />
</Field>
```

| Component  | Highlights                                                                                                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Select`   | A TextField-style trigger that opens a list. The list flips above when there's no room and supports keyboard and typeahead on web; `name` submits the value with forms. Uses TextField tokens |
| `TextArea` | Multi-line TextField that grows between `minimumRows` and `maxHeight`, with an optional remaining-characters counter and the same label and messages                                          |
| `Range`    | A slider: drag, tap the track, or use arrows, Page Up/Down, Home and End. On native the drag runs on the UI thread, and screen readers can adjust it. `min`, `max`, `step`, `formatValue`     |
| `Field`    | Label, required marker and animated helper/error/valid message around any control. Pass a function child to get the ids that link them for screen readers                                     |

### People

```tsx
import { Avatar, AvatarGroup } from 'cp-design-system';

<Avatar name="Ada Lovelace" src={photoUrl} presence="online" size="large" />
<AvatarGroup data={team.map((p) => ({ name: p.name, src: p.photo }))} maxCount={5} />
```

| Component     | Highlights                                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Avatar`      | Sizes 16 to 128. Shows colored initials (the same color for a name everywhere) until the image loads, and if it fails. Presence dot, `square` for projects, and `onPress` |
| `AvatarGroup` | Overlapping stack or grid. Stacked avatars lift on hover; the "+N" button expands the group with a staggered pop (or calls `onMorePress`)                                 |

### More overlays

```tsx
import { Button, Drawer, DropdownMenu, IconButton, InlineDialog, Popup, Tooltip } from 'cp-design-system';

<Popup
  isOpen={open}
  onClose={() => setOpen(false)}
  label="Filters"
  trigger={<Button onPress={() => setOpen(!open)}>Filters</Button>}
  content={<FiltersForm />}
/>

<InlineDialog isOpen={help} onClose={() => setHelp(false)} content="Usernames must be unique.">
  <IconButton icon="info" label="About usernames" onPress={() => setHelp(true)} />
</InlineDialog>

<Tooltip content="Copy link">
  <IconButton icon="add" label="Copy" />
</Tooltip>

<DropdownMenu
  trigger="Actions"
  items={[
    { label: 'Edit', icon: 'add', onPress: edit, group: 'Issue' },
    { label: 'Compact rows', isChecked: compact, onCheckedChange: setCompact, group: 'View' },
  ]}
/>

<Drawer isOpen={open} onClose={() => setOpen(false)} title="Create issue">
  <IssueForm />
</Drawer>
```

| Component      | Highlights                                                                                                                                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Popup`        | A floating panel anchored to any trigger. Flips and stays on screen; closes on Escape, outside clicks and Android back; moves focus in and back on web                                                                       |
| `InlineDialog` | A padded Popup for explaining the element it points at                                                                                                                                                                       |
| `Tooltip`      | Web: shows on hover (after `delay`) or keyboard focus, hides on Escape, and links to the trigger with `aria-describedby`. Native: shows on long-press and lingers briefly; the text becomes the trigger's accessibility hint |
| `DropdownMenu` | A button that opens a menu. Items can have sections (`group`), icons, descriptions, a disabled state, and checkboxes (the menu stays open while you toggle them). Use a text trigger or `{ icon, label }`                    |
| `Drawer`       | Web: slides in from the left or right with a blanket, focus trap and scroll lock. Native: a bottom sheet you can swipe down on its handle to dismiss                                                                         |

Flags now stay on top of an open Modal or Drawer on native too.

### Navigation

```tsx
import { Breadcrumbs, Pagination, Tabs } from 'cp-design-system';

<Tabs
  label="Project"
  tabs={[
    { id: 'overview', label: 'Overview', content: <Overview /> },
    { id: 'issues', label: 'Issues', content: <Issues /> },
  ]}
/>

<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects', href: '/projects' }, { label: 'Design system' }]} />

<Pagination pages={20} selectedIndex={page} onChange={setPage} />
```

| Component     | Highlights                                                                                                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tabs`        | An underline that springs to the selected tab, with a fading panel. Web: arrow, Home and End keys with roving focus. Native: the tab row scrolls. `shouldFitContainer` gives equal widths |
| `Breadcrumbs` | The last item is the current page. Long trails collapse into "…", which expands in place                                                                                                  |
| `Pagination`  | Previous and next arrows and page numbers, with "…" for long ranges. The current page uses `aria-current`                                                                                 |

### Carousel

A row of slides you swipe, drag, click through or move with the arrow keys. Slides snap with a spring. With a narrower `slideWidth`, the neighbours peek in, slightly scaled and faded as you drag.

```tsx
import { Carousel } from 'cp-design-system';

<Carousel label="Featured projects" slideWidth="85%">
  {projects.map((p) => (
    <ProjectCard key={p.id} project={p} />
  ))}
</Carousel>

<Carousel label="Highlights" loop autoPlay={5000}>
  {slides}
</Carousel>
```

| Prop                     | Default                    |                                                                                        |
| ------------------------ | -------------------------- | -------------------------------------------------------------------------------------- |
| `label`                  | (required)                 | Accessible name of the carousel                                                        |
| `index` / `defaultIndex` | `0`                        | Controlled or uncontrolled current slide; `onIndexChange` reports changes              |
| `slideWidth`             | `'100%'`                   | A percentage, so neighbours peek in, or pixels                                         |
| `space`                  | `'200'`                    | Gap between slides                                                                     |
| `showDots`               | `true`                     | Step dots (they're tabs, so they also jump to a slide)                                 |
| `showArrows`             | `true` web, `false` native | Previous and next buttons                                                              |
| `loop`                   | `false`                    | Wrap from the last slide to the first                                                  |
| `autoPlay`               | off                        | Milliseconds between slides. Pauses on hover, focus and touch; off with reduced motion |

Accessibility on web: the carousel is labelled as a carousel, each slide as "Slide 2 of 5", and only the current slide is exposed to assistive tech and the Tab key. Slide changes are announced unless autoplay is running. On native, a pan gesture drives the drag on the UI thread, and vertical page scrolling still works over the carousel. Theme key: `components.Carousel` (tokens `inactiveScale`, `inactiveOpacity`, `dotsGap`, `swipeThreshold`, `swipeVelocity`).

## FAQ

### Is this a React Native UI library or a React web UI library?

Both. `cp-design-system` ships two builds from one source. React DOM apps (Vite, Next.js, Create React App, Remix) get a web build animated with Motion. React Native and Expo apps get a native build animated with Reanimated. The import is the same: `import { Button } from 'cp-design-system'`.

### Does it work with Expo?

Yes, including Expo Go. Install `react-native-reanimated`, `react-native-worklets` and `react-native-gesture-handler` with `npx expo install`, and wrap your app in `ThemeProvider`. The demo app in the repo runs on Expo SDK 57.

### Do I need react-native-web?

No. Web apps use real DOM components, so the web build never imports React Native.

### Does it work with Next.js?

Yes. The components use hooks and context, so render them from client components (`'use client'`).

### How do I change the brand color or theme?

Pass one color: `createTheme({ brand: '#7C3AED' })`. That re-themes every brand, focus, selection and link token in light and dark mode, and keeps them WCAG-compliant. You can also override any Atlassian token, the radius, fonts and springs. Each component accepts `tokens` and `motion` props, and theme-wide defaults go under `createTheme({ components })`.

### Does it support dark mode?

Yes. `<ThemeProvider colorMode="system">` follows the OS or browser setting. `'light'` and `'dark'` force a mode.

### Is it accessible?

Yes. Components use the right ARIA roles and states on web, with keyboard navigation and focus management in menus, modals and drawers. Native components set accessibility roles, states, labels and actions. All motion respects the "reduce motion" setting.

### Is there a toast, modal, bottom sheet or select for React Native?

Yes: `Flag` (toast, with swipe to dismiss), `Modal`, `Drawer` (a bottom sheet on native), `Select`, `DropdownMenu`, `Tooltip`, `Popup` and `Carousel`. They all use the same API on web.

### Is it the official Atlassian Design System (Atlaskit)?

No. It's an independent, MIT-licensed library that follows Atlassian's design language. Its tokens are generated from `@atlaskit/tokens`, and its components are written from scratch for both web and native. Atlaskit is not a dependency.

### Does it support TypeScript?

Yes. It's written in TypeScript and ships its own types, so you don't need `@types` packages.

## License

MIT. Design tokens are derived from [`@atlaskit/tokens`](https://www.npmjs.com/package/@atlaskit/tokens) (Apache-2.0).
