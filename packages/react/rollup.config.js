import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import { visualizer } from 'rollup-plugin-visualizer'

export default [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/esm/index.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs({
        include: /node_modules/,
        requireReturnsDefault: 'auto',
      }),
      typescript({ tsconfig: './tsconfig.json', declaration: false, declarationMap: false }),
      json(),
      visualizer(),
    ],
    external: (id) => {
      // Externalize all node_modules except what we explicitly want to bundle
      // This prevents bundling transitive dependencies that cause issues
      if (/node_modules/.test(id)) {
        return true
      }
      // Also externalize these specific packages
      return ['react', 'react-dom', 'react/jsx-runtime', '@emotion/react', '@jsonui/core', 'lodash', 'jsonata', 'batchflow', 'redux', 'react-redux'].some(
        (pkg) => id === pkg || id.startsWith(`${pkg}/`)
      )
    },
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts({ tsconfig: './tsconfig.json' })],
    external: ['react', 'react-dom', 'react/jsx-runtime', '@emotion/react', '@jsonui/core', 'lodash', 'jsonata', 'batchflow', 'redux', 'react-redux'],
  },
]
