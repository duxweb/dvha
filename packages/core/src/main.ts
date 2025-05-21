import type { App } from 'vue'
import type { IConfig } from './types'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { initRouter } from './router/route'

export function createDux(config: IConfig) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  return {
    install(app: App) {
      app.provide('dux.config', config)
      app.use(initRouter(config))
      app.use(pinia)
    },
  }
}
