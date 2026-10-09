import { defineConfig } from 'tsup';

const external = ['react', 'react-dom', 'react-native'];

export default defineConfig([
  // Web: ESM + CJS, never references react-native.
  {
    entry: { index: 'src/index.web.ts', tokens: 'src/tokens/index.ts' },
    outDir: 'dist/web',
    format: ['esm', 'cjs'],
    outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.cjs' }),
    target: 'es2020',
    external,
    sourcemap: true,
    clean: true,
  },
  // Native: CommonJS so Metro and consumers' Jest both load it without extra transforms.
  {
    entry: { index: 'src/index.native.ts' },
    outDir: 'dist/native',
    format: ['cjs'],
    outExtension: () => ({ js: '.js' }),
    target: 'es2020',
    external,
    sourcemap: true,
    clean: true,
  },
  // Types: props are identical on both platforms, so one declaration file serves both.
  {
    entry: { index: 'src/index.web.ts', tokens: 'src/tokens/index.ts' },
    outDir: 'dist',
    dts: { only: true },
  },
]);
