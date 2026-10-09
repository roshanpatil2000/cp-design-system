# Changelog

## 0.2.0 (2026-10-09)

A rebuild on Atlassian's design language, with motion and brand theming. **Breaking:** the 0.1.x components and theme API are removed.

### Added

- **Theme foundation.** Atlassian's design tokens are generated from `@atlaskit/tokens` (about 340 light and dark semantic colors, spacing, radius, typography and motion). `@atlaskit/tokens` is not a runtime dependency.
- **`createTheme({ brand, colors, radius, fontFamily, text, motion, components })`.**
  - One brand color re-themes the brand, selection, focus and link tokens in both modes.
  - Brand text, links, icons and focus rings are kept at WCAG contrast.
- **`ThemeProvider`.**
  - `colorMode`: `light`, `dark` or `system`.
  - `motion`: `system`, `full` or `reduced`; `system` follows the OS reduce-motion setting.
  - `haptics`: an injectable adapter.
- **Toggle.** Atlassian's toggle, with a spring thumb, press squish, drag or flick to toggle, a loading pulse, haptics, and `appearance="brand"`.
- **Button.** Atlassian's six appearances and compact spacing, with:
  - a press spring and hover and pressed color transitions
  - a loading crossfade without layout shift
  - icons that receive the button's color
  - selected and full-width options
- **Customization** for every component: `theme.components.X` (`defaultProps`, `tokens`, `motion`), plus per-instance `tokens` and `motion` props.
- **`cp-design-system/tokens`.** The raw Atlassian tokens, usable without React.

### Removed

- `Box`, `Stack`, `VStack`, `HStack`, `Text`, `Input`, `Card`, `Badge` and the 0.1 `Button`.
- The old `lightTheme`, `darkTheme` and `createTheme(base, overrides)`, and the 0.1 token exports (`palette`, `spacing`, `radii`, `fontSizes` and others).

### Migrating from 0.1.x

- **Theme:** replace `ThemeProvider theme="dark"` with `ThemeProvider colorMode="dark"`, and build custom themes with `createTheme({ brand })`.
- **Button:** `variant` and `tone` map to `appearance` (`'primary'`, `'subtle'`, `'danger'` and others), and `size="sm"` becomes `spacing="compact"`.
- **Removed layout and text components:** use your own `View`/`div` and `Text` with `useTheme()` for now. New versions are coming one at a time.

### Requirements

- React Native apps now need `react-native-reanimated` (4+), `react-native-worklets` and `react-native-gesture-handler` (2.20+). Web apps need nothing extra.

## 0.1.2

- Removed an accidental self-dependency from 0.1.1.

## 0.1.0

- First release: tokens, light and dark themes, Box, Stack, Text, Button, Input, Card and Badge.
