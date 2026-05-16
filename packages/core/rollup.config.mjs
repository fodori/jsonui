import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
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
        tsconfig: './tsconfig.rollup.json',
        declaration: false,
        declarationMap: false,
      }),
      visualizer(),
    ],
    external: (id) => {
      if (/node_modules/.test(id)) {
        return true
      }
      return id === 'tslib' || id.startsWith('tslib/')
    },
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts({ tsconfig: './tsconfig.build.json' })],
    external: ['ajv', 'ajv-errors', 'ajv-formats', 'jsonata', 'tslib'],
  },
]
