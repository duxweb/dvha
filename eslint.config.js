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
  files: ['packages/pro/src/pages/menu/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': ['error', {
      paths: [
        {
          name: '.',
          message: 'menu 目录内部请直接引用具体文件，避免通过 index 形成循环依赖。',
        },
        {
          name: './index',
          message: 'menu 目录内部请直接引用具体文件，避免通过 index 形成循环依赖。',
        },
      ],
    }],
  },
})
