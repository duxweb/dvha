import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/dvha/start/' : '/',
  plugins: [
    vue(),
    VueJsx(),
  ],
  resolve: {
    alias: {
      '@duxweb/dvha-core': resolve(__dirname, '../../packages/core/src'),
      '@duxweb/dvha-naiveui': resolve(__dirname, '../../packages/naiveui/src'),
      '@duxweb/dvha-elementui': resolve(__dirname, '../../packages/elementui/src'),
      '@duxweb/dvha-pro': resolve(__dirname, '../../packages/pro/src'),
    },
  },
  output: {
    manualChunks: {
      'vendor-vue': ['vue', 'vue-router'],
      'vendor-naive': ['naive-ui'],
      'vendor-echarts': ['echarts', 'vue-echarts'],
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
