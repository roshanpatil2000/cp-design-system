import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/react-vite',
  viteFinal: (viteConfig) => {
    // Point at the package's web source (not dist) so edits hot-reload without a rebuild.
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      'cp-design-system': fileURLToPath(
        new URL('../../../packages/cp-design-system/src/index.web.ts', import.meta.url),
      ),
    };
    return viteConfig;
  },
};

export default config;
