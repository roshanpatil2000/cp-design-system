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

**First release (manual):**

```bash
npm login
yarn build
cd packages/cp-design-system && npm publish --dry-run   # inspect the tarball
npm publish
```

**After that (automated):**

1. Create an npm **automation** access token and add it to the GitHub repo secrets as `NPM_TOKEN`.
2. For each change, run `yarn changeset`, then commit the generated file with your PR.
3. On merge to `main`, the Release workflow opens a "Version Packages" PR (bumps the version and writes CHANGELOG.md). Merging that PR publishes to npm with provenance.
