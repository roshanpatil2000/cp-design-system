# Changelog

## 0.6.3 (2026-10-17)

### Fixed

- **Drawer and Popup (web)** no longer lose keyboard focus when closed right after opening. Focus now returns to the trigger instead of falling to the page body.

## 0.6.2 (2026-10-17)

### Changed

- **npm page and docs.** New description and keywords, and a homepage pointing at the live Storybook docs. The README gains badges, a current quick start, a linked component index and an FAQ.
- **`llms.txt`** now ships with the package so AI assistants can describe and use the library correctly.
- No code changes.

## 0.6.1 (2026-10-14)

### Fixed

- README: removed a stale "Next release" row from the component status table. No code changes.

## 0.6.0 (2026-10-14)

### Added

- **Carousel.** Swipeable slides with spring snapping.
  - With a percentage `slideWidth`, neighbouring slides peek in, scaling and fading as you drag.
  - Dots you can select, arrows, `loop`, and `autoPlay`. Autoplay pauses on hover, focus and touch, and is off with reduced motion.
  - On web: arrow keys, plus carousel and slide labels for screen readers.
  - On native: dragging runs on the UI thread, and vertical scrolling of the page still works over it.

### Fixed

- **Lozenge, Badge and Tag (web)** keep their own width inside flex columns such as Stack instead of stretching.

## 0.5.1 (2026-10-13)

### Fixed

- **Lozenge, Badge and Tag (native)** now center in a row (for example inside `Inline alignBlock="center"`) instead of sticking to the top.
- **ProgressBar (native)** shows its fill on the first frame on Android.
- **Tabs (native)** no longer leave the underline invisible after the first layout on Android.
- **Tabs (web)** place the underline instantly on page load instead of animating it in from zero width.

## 0.5.0 (2026-10-13)

Completes the planned component set: 40 components on web and React Native.

### Added

- **Actions.**
  - `IconButton`.
  - `LinkButton`: a real `<a href>` on web; opens the URL on native.
  - `SplitButton`.
- **Forms.**
  - `Select`, with keyboard and typeahead on web.
  - `TextArea`, which grows as you type and has a character counter.
  - `Range`, a slider you can drag, tap or adjust from the keyboard; on native the drag runs on the UI thread.
  - `Field`, which wraps any control with a label and messages.
- **People.**
  - `Avatar`, with initials fallback and presence.
  - `AvatarGroup`, in stack or grid layout; "+N" expands it.
- **Overlays.**
  - `Popup` and `InlineDialog`.
  - `Tooltip`: hover and focus on web, long-press on native.
  - `DropdownMenu`, with sections, icons, descriptions and checkbox items.
  - `Drawer`: a side panel on web and a swipeable bottom sheet on native.
- **Navigation.**
  - `Tabs`, with a springy underline and keyboard support.
  - `Breadcrumbs`, which collapse long trails.
  - `Pagination`.

### Changed

- Flags now appear above an open Modal or Drawer on native.
- Button accepts `accessibilityHint`, and passes `aria-describedby` through, so tooltips describe it.
- Anchored menus and popups flip and stay inside the screen on both platforms.

## 0.4.0 (2026-10-13)

### Added

- **Building blocks.**
  - `Box`, `Stack` and `Inline` for token-based spacing, color, borders and layout.
  - `Text` and `Heading` on Atlassian's type scale.
  - `Icon`, with 12 built-in glyphs and no SVG dependency.
  - `Pressable`, the shared hover, press and focus treatment.
- **Feedback.**
  - `Spinner` is now public, with sizes, an inverted appearance and an accessible label.
  - `ProgressBar` springs to new values and has an indeterminate state.
  - `ProgressIndicator` dots stretch for the current step and can be selected.
  - `Lozenge`.
  - `Badge` caps counts at 99+ and pops when the value changes.
  - `Tag` comes in 11 colors; removable tags animate out.
  - `Banner` and `SectionMessage`.
  - `Skeleton` pulses while loading.
  - `EmptyState`.
- Theme keys under `components` for the new components (default props, tokens and motion).

## 0.3.0 (2026-10-10)

### Added

- **TextField.** Atlassian's text field with label, helper, error and valid messages, a character counter, password and monospaced modes, and animated focus and messages.
- **Checkbox.** An animated fill and tick, a press pop, the indeterminate (mixed) state, and invalid and required styles. Uses a real checkbox input on web.
- **RadioGroup and Radio.** A spring-in dot. Uses native radio inputs on web, so arrow keys and form submission work.
- **FlagProvider and `useFlags()`.** Atlassian's flags (toasts):
  - five appearances and optional action links
  - auto-dismiss after 8 seconds, with a countdown bar that pauses on hover, focus or touch
  - swipe to dismiss, and replace by id
  - `maxFlags` caps how many show at once
- **Modal.**
  - Atlassian's widths and enter/exit motion, with warning and danger icons.
  - Web: focus trap, Escape and blanket close, scroll lock and focus restore.
  - Native: an RN `Modal` that closes on Android back.

### Changed

- `react-dom` is now an optional peer dependency, needed on web for flags and modals.

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
