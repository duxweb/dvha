import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    VueJsx(),
    UnoCSS(),
  ],
  optimizeDeps: {
    exclude: [
      "@duxweb/dvha-core",
      "@duxweb/dvha-naiveui",
      "@duxweb/dvha-elementui",

    ]
  }
})
