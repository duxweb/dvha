import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,

  formatters: true,
  isInEditor: true,
  rules: {
    '@tanstack/query/exhaustive-deps': 'error',
    'perfectionist/sort-exports': 'off',
    'perfectionist/sort-named-exports': 'off',
  },
})
