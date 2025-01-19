import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Add your custom rules here
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      // Add your custom rules here
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off',
    },
  },
]

export default eslintConfig
