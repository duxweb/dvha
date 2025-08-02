import type { IDataProviderResponse, IS3SignData } from '@duxweb/dvha-core'
import type { App } from 'vue'

import initUnocssRuntime from '@unocss/runtime'
import VueECharts from 'vue-echarts'
import component from './component'
import { initVeeValidate } from './config'

import { config as unoConfig } from './config/uno'
import 'echarts'
import 'vue-cropper/dist/index.css'
import 'aieditor/dist/style.css'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
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

// 声明 Pro 包特有的配置
declare module '@duxweb/dvha-core' {
  interface IManage {
    // 上传配置
    upload?: {
      method?: 'POST' | 'PUT'
      driver?: 'local' | 's3'
      signPath?: string
      signCallback?: (response: IDataProviderResponse) => IS3SignData
    }
    // 接口路径
    apiPath?: {
      upload?: string
      uploadManager?: string
      ai?: string
      [key: string]: any
    }
    // 通知配置
    notice?: {
      status?: false
      path?: string
      route?: string
      titleField?: string
      descField?: string
      readField?: string
      action: {
        label?: string
        url?: string
      }

    }
  }
}
