import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files:['**/*.ts','**/*.tsx'],
    languageOptions:{
      parser:tsParser,
      parserOptions:{
        project:['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins:{
      '@typescript-eslint': tsPlugin,
    },
    rules:{
      'no-console':'warn',
    },
  },
  {
    ignores:['node_modules/','dist/','build/','.next/','.turbo/'],
  },
];
