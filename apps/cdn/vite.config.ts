import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    VueJsx(),
  ],
  base: '/static/web/',
  resolve: {
    // alias: {
    //   '@duxweb/dvha-core': resolve(__dirname, '../../packages/core/src'),
    //   '@duxweb/dvha-naiveui': resolve(__dirname, '../../packages/naiveui/src'),
    //   '@duxweb/dvha-elementui': resolve(__dirname, '../../packages/elementui/src'),
    //   '@duxweb/dvha-pro': resolve(__dirname, '../../packages/pro/src'),
    // },
  },
  server: {
    cors: {
      origin: '*',
    },
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    manifest: true,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      input: {
        index: 'main.ts',
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
          'vendor-dux': ['@duxweb/dvha-core', '@duxweb/dvha-pro'],
        },
      },
    },
  },
})
