module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'src/App.tsx', 'vite.config.ts'],
  overrides: [
    {
      files: ['src/**/*'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'error',
      },
    },
    {
      files: ['postcss.config.js'],
      parserOptions: {
        project: null,
      },
    },
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
        project: ['./tsconfig.eslint.json'],

  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    'prettier/prettier': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/explicit-function-return-type': 'error', 
    '@typescript-eslint/explicit-module-boundary-types': 'error', 
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'variable',
        'format': ['camelCase'],
        'leadingUnderscore': 'allow',
      },
      {
        'selector': 'function',
        'format': ['PascalCase'],
      },
      {
        'selector': 'variable',
        'types': ['function'],
        'format': ['camelCase'],
      },
    ], 
    'no-console': 'warn', 
    'curly': 'error', 
    'eqeqeq': 'error',
  },
}
