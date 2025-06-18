import { defineConfig } from 'unocss'
import { config } from './src/config'

export default defineConfig({
  ...config(true),
  include: ['src/**/*.ts', 'src/**/*.tsx'],
})
