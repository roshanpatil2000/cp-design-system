# cp-design-system

A cross-platform design system for **React (web)** and **React Native**. One set of design tokens and one component API, with native rendering on each platform: DOM elements on the web, `View`/`Text`/`Pressable` on mobile. Web apps don't need `react-native-web`.

## Install

```bash
npm install cp-design-system
# or
yarn add cp-design-system
# or
pnpm add cp-design-system
```

Peer dependencies: `react >= 18`, and `react-native >= 0.74` for native apps only.

## Usage

The import is the same on every platform. The bundler picks the right build automatically:

| Bundler                      | Build used                                            |
| ---------------------------- | ----------------------------------------------------- |
| Metro (React Native / Expo)  | `dist/native` via the `react-native` export condition |
| Vite, webpack, Next.js, etc. | `dist/web` (ESM or CJS)                               |

```tsx
import { ThemeProvider, VStack, Text, Button, Input } from 'cp-design-system';

export function SignIn() {
  const [email, setEmail] = useState('');
  return (
    <ThemeProvider theme="light">
      <VStack gap={4} p={6}>
        <Text variant="heading">Welcome back</Text>
        <Input label="Email" keyboardType="email" value={email} onChangeText={setEmail} />
        <Button onPress={() => signIn(email)} fullWidth>
          Sign in
        </Button>
      </VStack>
    </ThemeProvider>
  );
}
```

## Components

| Component                   | Key props                                                                                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Box`                       | `p`, `px`, `py`, `m`, `mx`, `my`, `bg`, `radius`, `borderColor`, `borderWidth`, `direction`, `align`, `justify`, `gap`, `wrap`, `flex`, `width`, `height` |
| `Stack`, `VStack`, `HStack` | everything on `Box`; `gap` defaults to `3`                                                                                                                |
| `Text`                      | `variant` (`title` · `heading` · `subheading` · `body` · `label` · `caption`), `color`, `weight`, `align`, `numberOfLines`                                |
| `Button`                    | `variant` (`solid` · `outline` · `ghost`), `tone` (`primary` · `danger`), `size`, `disabled`, `fullWidth`, `onPress`                                      |
| `Input`                     | `value`, `onChangeText`, `label`, `helperText`, `error`, `placeholder`, `secureTextEntry`, `keyboardType`, `disabled`                                     |
| `Card`                      | `padding`, `elevated`                                                                                                                                     |
| `Badge`                     | `tone` (`neutral` · `primary` · `success` · `warning` · `danger`)                                                                                         |

Every component accepts `testID`. On the web it becomes `data-testid`.

## Theming

```tsx
import { ThemeProvider, createTheme, lightTheme, useTheme } from 'cp-design-system';

// Built-in: theme="light" | "dark". Or extend one:
const brand = createTheme(lightTheme, { name: 'brand', colors: { primary: '#7c3aed' } });

export const App = () => <ThemeProvider theme={brand}>{/* … */}</ThemeProvider>;

// Read tokens inside your own components:
const { colors, spacing } = useTheme();
```

## Tokens only

Raw tokens are available on their own, with no React components:

```ts
import { palette, spacing, radii, fontSizes } from 'cp-design-system/tokens';
```

## License

MIT
