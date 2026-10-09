# cp-design-system

Cross-platform design system for React (web) and React Native, published to npm as [`cp-design-system`](https://www.npmjs.com/package/cp-design-system). Package docs: [packages/cp-design-system/README.md](packages/cp-design-system/README.md).

## How it works

Each component has a shared core and two thin renderers:

```
src/components/Button/
├─ Button.types.ts     # props, identical on both platforms
├─ Button.styles.ts    # token → style logic, platform-neutral
├─ Button.web.tsx      # renders <button>
└─ Button.native.tsx   # renders <Pressable>
```

`src/index.web.ts` and `src/index.native.ts` export the matching renderers. tsup builds them to `dist/web` and `dist/native`. The `exports` map in `package.json` sends Metro to the native build (`react-native` condition) and every other bundler to the web build. The web build never imports `react-native`.

## Repo layout

| Path                        | What                                                               |
| --------------------------- | ------------------------------------------------------------------ |
| `packages/cp-design-system` | The published package                                              |
| `apps/storybook`            | Storybook (web). Reads package **source**, so edits hot-reload     |
| `apps/expo-example`         | Expo app. Uses the **built** package, exactly like a real consumer |

## Development

```bash
yarn install
yarn storybook          # web playground at http://localhost:6006
yarn dev                # rebuild the package on change (needed for the Expo app)
yarn example            # start the Expo app (press i for iOS simulator)
yarn test               # Vitest (web) + Jest (native)
yarn typecheck && yarn lint
```

### Adding a component

1. Create `src/components/Foo/` with `Foo.types.ts`, `Foo.styles.ts`, `Foo.web.tsx` and `Foo.native.tsx`.
2. Export the renderer from `index.web.ts` and `index.native.ts`, and its types from `shared.ts`.
3. Add tests to `src/__tests__/components.{web,native}.test.tsx`, plus a story in `apps/storybook/stories`.

## Publishing

npm, yarn, pnpm and bun all install from the **npm registry**, so publishing once to npm covers all of them.

Releases are automatic. The Release workflow runs on every push to `main` and publishes the package **only when its version isn't on npm yet**. No npm token is stored anywhere: GitHub Actions authenticates through npm [trusted publishing](https://docs.npmjs.com/trusted-publishers).

**To release a change:**

1. In your branch, bump the version from `packages/cp-design-system`:
   ```bash
   npm version patch --no-git-tag-version   # or minor / major
   ```
2. Commit the `package.json` change with your PR and merge it to `main`.
3. The workflow runs typecheck, tests and the build, publishes to npm, and tags the commit `vX.Y.Z`.

Merges that don't change the version publish nothing.

**Use patch** for fixes (0.1.2 → 0.1.3), **minor** for new components or props (0.1.2 → 0.2.0) and **major** for breaking changes (0.1.2 → 1.0.0).

> Never run `yarn add cp-design-system` or `npm install cp-design-system` inside this repo. The apps already use the local package, and installing it into itself creates a self-dependency.
