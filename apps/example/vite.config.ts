import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig(() => ({
  plugins: [
    vue(),
    VueJsx(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@duxweb/dvha-core': path.resolve(__dirname, '../../packages/core/src'),
      '@duxweb/dvha-naiveui': path.resolve(__dirname, '../../packages/naiveui/src'),
      '@duxweb/dvha-elementui': path.resolve(__dirname, '../../packages/elementui/src'),
    },
  },
}))
