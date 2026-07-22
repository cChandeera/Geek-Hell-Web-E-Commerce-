import js from '@eslint/js';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
];
