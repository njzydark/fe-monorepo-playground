import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default defineConfig(
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/src/**/*.[j|t]sx?'],
  },
  {
    ignores: ['**/dist/**'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierRecommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      // TODO why?
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react/jsx-uses-react': 'warn',
      'react/display-name': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
)
