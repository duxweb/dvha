import antfu from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default antfu({
  unocss: true,
  vue: true,

  formatters: true,
  isInEditor: true,
  plugins: {
    '@tanstack/query': pluginQuery,
  },
  rules: {
    '@tanstack/query/exhaustive-deps': 'error',
    'perfectionist/sort-exports': 'off',
    'perfectionist/sort-named-exports': 'off',
  },
})
