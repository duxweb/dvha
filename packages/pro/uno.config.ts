import { defineConfig } from 'unocss'
import { config } from './src/config'

export default defineConfig({
  ...config(true),
  content: {
    pipeline: {
      include: ['src/**/*.ts', 'src/**/*.tsx'],
    },
  },
})
