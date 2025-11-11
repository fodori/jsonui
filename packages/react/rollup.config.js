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
    plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json', declaration: false, declarationMap: false }), json(), visualizer()],
    // external: [...Object.keys(packageJson.dependencies || {}), ...Object.keys(packageJson.peerDependencies || {})],
    external: ['react', 'react-dom', '@emotion/react', '@jsonui/core', 'lodash', 'jsonata', 'batchflow', 'redux', 'react-redux'],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts({ tsconfig: './tsconfig.json' })],
    external: ['react', 'react-dom', '@jsonui/core'],
  },
]
