import type { StorybookConfig } from '@storybook/react-vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '../../..')

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const prevAlias = config.resolve?.alias
    const reactSrc = path.join(repoRoot, 'packages/react/src/index.ts')
    const coreSrc = path.join(repoRoot, 'packages/core/src/index.ts')

    const alias = Array.isArray(prevAlias)
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        [...prevAlias, { find: '@jsonui/react' as const, replacement: reactSrc }, { find: '@jsonui/core' as const, replacement: coreSrc }]
      : {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          ...(typeof prevAlias === 'object' && prevAlias !== null ? prevAlias : {}),
          '@jsonui/react': reactSrc,
          '@jsonui/core': coreSrc,
        }

    return mergeConfig(config, {
      resolve: {
        dedupe: ['react', 'react-dom'],
        alias,
      },
      server: {
        fs: {
          allow: [...(config.server?.fs?.allow ?? []), repoRoot],
        },
      },
    })
  },
}

export default config
