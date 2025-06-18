import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

export default defineConfig(() => ({
  plugins: [
    vue(),
    VueJsx(),
  ],
  resolve: {
    conditions: [
      // 'dvha:development',
      'import',
      'default',
    ],
  },
  output: {
    manualChunks: {
      'vendor-vue': ['vue', 'vue-router'],
      'vendor-naive': ['naive-ui'],
      'vendor-vueuse': ['@vueuse/core'],
      'vendor-pinia': ['pinia', 'pinia-plugin-persistedstate'],
      'vendor-loader': ['vue3-sfc-loader'],
      'vendor-lodash': ['lodash-es', 'lodash'],
      'vendor-icon': ['@iconify-json/tabler'],
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
      },
      output: {
      },
    },
    outDir: resolve(__dirname, 'dist'),
  },
}))
