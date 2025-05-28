import type { App } from 'vue'
import type { IConfig } from './types'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { ref } from 'vue'
import { permissionDirective } from './directive'
import { initRouter } from './router/route'

export function createDux(config: IConfig) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  return {
    install(app: App) {
      // eslint-disable-next-line no-console
      console.log(
        `%c dux-vue %c dux.cn %c`,
        'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
        'background:transparent',
      )

      const manageRef = ref<string>()
      app.provide('dux.config', config)
      app.provide('dux.manage', manageRef)
      app.directive('can', permissionDirective)
      app.use(VueQueryPlugin)
      app.use(initRouter(config))
      app.use(pinia)
    },
  }
}
