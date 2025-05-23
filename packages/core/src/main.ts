import { ref, type App } from 'vue'
import type { IConfig } from './types'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { initRouter } from './router/route'

export function createDux(config: IConfig) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  return {
    install(app: App) {

      console.log(
        `%c dux-vue %c dux.cn %c`,
        'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
        'background:transparent'
      )

      const manageRef = ref<string>()
      app.provide('dux.config', config)
      app.provide('dux.manage', manageRef)
      app.use(initRouter(config))
      app.use(pinia)
    },
  }
}
