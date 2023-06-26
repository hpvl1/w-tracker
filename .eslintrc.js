module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-strongly-recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'comma-spacing': ['error', { before: false, after: true }],
    'vue/no-multi-spaces': 0,
    'no-unused-vars': 'warn',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 3,
        },
      },
    ],
  },
};
