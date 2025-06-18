import type { App } from 'vue'

import initUnocssRuntime from '@unocss/runtime'
import component from './component'
import { initVeeValidate } from './config'
import { config as unoConfig } from './config/uno'

import './theme/style.scss'

export function createDuxPro() {
  initVeeValidate()

  initUnocssRuntime({
    defaults: unoConfig(false),
    bypassDefined: true,
  })

  return {
    install(app: App) {
      app.use(component)
    },
  }
}
