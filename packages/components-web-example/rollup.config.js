import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import { visualizer } from 'rollup-plugin-visualizer'
import css from 'rollup-plugin-css-only'
import packageJson from './package.json'

export default [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      css(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', exclude: ['**/*.stories.ts', '**/*.stories.tsx'] }),
      json(),
      visualizer(),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [css(), dts()],
    external: ['react', 'react-dom'],
  },
]
