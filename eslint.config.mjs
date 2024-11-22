// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        var1: 'writable',
        var2: 'readonly',
        process: true,
        console: true,
      },
    },
  },
  {
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/src/**',
      '**/app/config/**',
      '**/public/**',
      '.env',
    ],
  },
);
