module.exports = {
  // root: true,
  extends: ['egg', 'plugin:prettier/recommended'],
  env: {
    node: true,
  },
  globals: {},
  parserOptions: {
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  rules: {
    'prettier/prettier': 'error',
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-return-await': 'error',
    'no-unused-vars': 'warn',
    'prefer-destructuring': 'error',
    'no-console': 'warn',
  },
}
