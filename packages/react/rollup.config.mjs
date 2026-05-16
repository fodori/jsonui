import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'

export default [
  {
    input: 'src/index.ts',
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
      return ['react', 'react-dom', 'react/jsx-runtime', '@jsonui/core', 'tslib'].some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
    },
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts({ tsconfig: './tsconfig.build.json' })],
    external: ['react', 'react-dom', 'react/jsx-runtime', '@jsonui/core', 'tslib'],
  },
]
