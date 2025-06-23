import antfu from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'
import unusedImports from 'eslint-plugin-unused-imports'

export default antfu({
  vue: true,
  ignores: ['dist', 'node_modules', 'dist-types'],
  formatters: {
    // 禁用对 markdown 文件的格式化
    markdown: false,
  },
  isInEditor: true,
}, {
  plugins: {
    '@tanstack/query': pluginQuery,
    'unused-imports': unusedImports,
  },
  rules: {
    // 'no-unused-vars': 'off',
    '@tanstack/query/exhaustive-deps': 'error',
    'unused-imports/no-unused-imports': 'error',
  },
}, {
  // 专门为 markdown 文件添加忽略规则
  files: ['**/*.md'],
  rules: {
    // 禁用所有格式化相关规则
    'style/*': 'off',
    'format/*': 'off',
    '@stylistic/*': 'off',
  },
})
