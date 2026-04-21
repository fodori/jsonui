import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import storybook from 'eslint-plugin-storybook'
import prettier from 'eslint-config-prettier'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url))

const typeCheckedLanguageOptions = {
  parserOptions: {
    projectService: true,
    tsconfigRootDir,
    allowDefaultProject: true,
  },
}

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/build/**',
      '**/storybook-static/**',
      'docs/**',
      '**/coverage/**',
      'packages/docs-site/src/react-json-editor-en.js',
      'eslint.config.mjs',
      '**/*.config.mjs',
      '**/*.config.cjs',
      '**/rollup.config.*',
      '**/babel.config.*',
      '**/jest.config.*',
      'packages/**/setupTests.*',
      'packages/docs-site/src/setupTests.ts',
      'packages/**/public/**',
      '**/vite.config.ts',
      '**/vitest.config.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: typeCheckedLanguageOptions,
    rules: {
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-unnecessary-template-expression': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unnecessary-type-conversion': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-spread': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      react,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      ...typeCheckedLanguageOptions,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      'react/jsx-props-no-spreading': 'off',
      'react/function-component-definition': 'off',
      'react/destructuring-assignment': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
        node: true,
      },
    },
    rules: {
      'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never', js: 'never', jsx: 'never', mts: 'never', cts: 'never' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      // @storybook/react-vite re-exports runtime from @storybook/react, but its published .d.ts is broken for CSF types (TS2305).
      'storybook/no-renderer-packages': 'off',
    },
  },
  {
    files: ['**/*.stories.{ts,tsx,js,jsx}'],
    rules: {
      'storybook/default-exports': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-duplicates': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
  prettier
)
