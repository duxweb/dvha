import type { App } from 'vue'
import type { IConfig } from '@/types'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { provide } from 'vue'
import { initRouter } from './router'

export function createDux(config: IConfig) {
  provide('dux.config', config)

  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  return {
    install(app: App) {
      app.use(initRouter(config))
      app.use(pinia)
    },
  }
}
