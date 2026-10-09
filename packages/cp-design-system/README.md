# cp-design-system

An animated, brand-themable design system for **React (web)** and **React Native**, built on [Atlassian's design tokens](https://atlassian.design/foundations/tokens/design-tokens).

- **Atlassian's design language.** About 340 semantic colors (light and dark), spacing, radius, typography and motion, generated from `@atlaskit/tokens`. Atlaskit itself is not a runtime dependency.
- **One API, all platforms.** Each component renders with the DOM on the web and with native views on iOS and Android.
- **Motion built in.** Springs run on Reanimated (native) and Motion (web), driven by the same tokens. The OS "reduce motion" setting is respected automatically.
- **Your brand, not ours.** One brand color re-themes every brand, selection, focus and link token in both modes, with WCAG contrast enforced. Every component can be restyled globally or per instance.

> **Status:** the theme and motion foundation is ready. Components are being added one at a time; see [Components](#components).

## One API, all platforms

![The same Toggle settings screen rendered on the web, iOS and Android](https://raw.githubusercontent.com/roshanpatil2000/cp-design-system/main/docs/images/one-api-all-platforms.png)

You write it once:

```tsx
import { Toggle } from 'cp-design-system';

<Toggle label="Wi-Fi" defaultChecked />
<Toggle label="Dark mode" size="large" appearance="brand" />
```

How each platform renders it:

- **Web:** a real `<button role="switch">`, animated with Motion.
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

| Status  | Component                                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------------------- |
| Ready   | [Toggle](#toggle)                                                                                                         |
| Planned | Button, Text field, Checkbox, Radio, Select, Spinner, Lozenge, Badge, Flag (toast), Modal, Tooltip, Tabs, Avatar and more |

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

## License

MIT. Design tokens are derived from [`@atlaskit/tokens`](https://www.npmjs.com/package/@atlaskit/tokens) (Apache-2.0).
