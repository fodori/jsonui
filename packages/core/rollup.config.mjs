/* eslint-disable import/no-extraneous-dependencies */
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { visualizer } from 'rollup-plugin-visualizer'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/esm/index.js',
        format: 'esm',
        sourcemap: true,
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
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
      }),
      json(),
      visualizer(),
    ],
    external: (id) => {
      // Externalize all node_modules - don't bundle any dependencies
      if (/node_modules/.test(id)) {
        return true
      }
      // Also externalize these specific packages
      return ['react', 'react-dom', 'lodash', 'redux', 'tslib'].some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
    },
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts({ tsconfig: './tsconfig.json' })],
    external: [
      'react',
      'react-dom',
      'lodash',
      'redux',
      'ajv',
      'ajv-errors',
      'ajv-formats',
      'immer',
      'jsonata',
      'jsonpointer',
      'key-value-replace',
      'traverse',
      'tslib',
    ],
  },
]
