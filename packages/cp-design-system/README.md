# cp-design-system

An animated, brand-themable design system for **React (web)** and **React Native**, built on [Atlassian's design tokens](https://atlassian.design/foundations/tokens/design-tokens).

- **Atlassian's design language.** About 340 semantic colors (light and dark), spacing, radius, typography and motion, generated from `@atlaskit/tokens`. Atlaskit itself is not a runtime dependency.
- **One API, all platforms.** Each component renders with the DOM on the web and with native views on iOS and Android.
- **Motion built in.** Springs run on Reanimated (native) and Motion (web), driven by the same tokens. The OS "reduce motion" setting is respected automatically.
- **Your brand, not ours.** One brand color re-themes every brand, selection, focus and link token in both modes, with WCAG contrast enforced. Every component can be restyled globally or per instance.

> **Status:** 0.2.0 ships the theme and motion foundation, **Button** and **Toggle**. More components are added one at a time; see [Components](#components) and the [changelog](https://github.com/roshanpatil2000/cp-design-system/blob/main/packages/cp-design-system/CHANGELOG.md).

## One API, all platforms

![The same settings screen, with a text field, toggles and buttons, rendered on the web, iOS and Android](https://raw.githubusercontent.com/roshanpatil2000/cp-design-system/main/docs/images/one-api-all-platforms.png)

You write it once:

```tsx
import { Button, TextField, Toggle } from 'cp-design-system';

<TextField label="Display name" defaultValue="Roshan Patil" maxCharacters={30} />
<Toggle label="Wi-Fi" defaultChecked />
<Toggle label="Dark mode" size="large" appearance="brand" />
<Button appearance="primary" onPress={save}>Save</Button>
```

How each platform renders it:

- **Web:** real `<button>` elements, animated with Motion.
- **iOS and Android:** native views, animated on the UI thread with Reanimated and Gesture Handler.

Your bundler picks the right build automatically.

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

## Components

Each component is built and tested on both platforms before release.

| Status        | Component                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Ready (0.2.0) | [Button](#button), [Toggle](#toggle)                                                                                              |
| Next release  | [Text field](#text-field), [Checkbox](#checkbox), [Radio group](#radio-group), [Flag](#flag-toast), [Modal dialog](#modal-dialog) |
| Planned       | Select, Spinner, Lozenge, Badge, Tooltip, Tabs, Avatar and more                                                                   |

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

## License

MIT. Design tokens are derived from [`@atlaskit/tokens`](https://www.npmjs.com/package/@atlaskit/tokens) (Apache-2.0).
