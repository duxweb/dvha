import type { App } from 'vue'

import initUnocssRuntime from '@unocss/runtime'
import VueECharts from 'vue-echarts'
import component from './component'
import { initVeeValidate } from './config'
import { config as unoConfig } from './config/uno'

import 'echarts'
import 'vue-cropper/dist/index.css'
import 'aieditor/dist/style.css'
import './theme/style.scss'

export function createDuxPro() {
  initVeeValidate()

  initUnocssRuntime({
    defaults: unoConfig(false),
    bypassDefined: true,
  })

  return {
    install(app: App) {
      app.component('v-chart', VueECharts)
      app.use(component)
    },
  }
}

declare module '@duxweb/dvha-core' {
  interface IManage {
    // Pro 包特有的配置
    apiPath?: {
      upload?: string
      ai?: string
      [key: string]: any
    }
  }
}
