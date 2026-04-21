import type { StorybookConfig } from '@storybook/react-vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const reactPackageRoot = path.resolve(dirname, '..')
const repoRoot = path.resolve(dirname, '../../..')

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal(viteConfig) {
    viteConfig.resolve = viteConfig.resolve ?? {}
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@jsonui/react': path.join(reactPackageRoot, 'src/index.ts'),
      '@jsonui/core': path.join(repoRoot, 'packages/core/src/index.ts'),
    }
    viteConfig.server = viteConfig.server ?? {}
    viteConfig.server.fs = {
      ...viteConfig.server.fs,
      allow: [...(viteConfig.server.fs?.allow ?? []), repoRoot],
    }
    return viteConfig
  },
}

export default config
