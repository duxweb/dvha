import type { IDataProviderResponse, IS3SignData } from '@duxweb/dvha-core'
import type { UserConfigDefaults } from '@unocss/core'

import type { App } from 'vue'
import initUnocssRuntime from '@unocss/runtime'
import VueECharts from 'vue-echarts'
import * as vueDraggablePlus from 'vue-draggable-plus'
import component from './component'

import { initVeeValidate } from './config'
import { config as unoConfig } from './config/uno'
import 'echarts'
import 'vue-cropper/dist/index.css'
import 'aieditor/dist/style.css'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import './theme/style.scss'

export const duxProRemotePackages = {
  'vue-draggable-plus': vueDraggablePlus,
}

export function createDuxPro() {
  initVeeValidate()

  initUnocssRuntime({
    defaults: unoConfig(false) as UserConfigDefaults,
    bypassDefined: true,
  })

  return {
    install(app: App) {
      app.component('v-chart', VueECharts)
      app.use(component)
    },
  }
}

interface ITool {
  label: string
  icon: string
  type?: 'route' | 'link' | 'modal' | 'callback'
  path?: string
  url?: string
  loader?: string
  title?: string
  width?: number | string
  draggable?: boolean
  componentProps?: Record<string, any>
  callback?: () => void
  [key: string]: any
}

interface IUserMenu {
  key: string
  label: string
  icon: string
  path?: string
  url?: string
  loader?: string
  type?: 'route' | 'link' | 'modal' | 'callback'
  title?: string
  width?: number | string
  draggable?: boolean
  componentProps?: Record<string, any>
  callback?: () => void
  [key: string]: any
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
      urlField?: string
    }
    // 工具配置
    tools?: ITool[]

    // 用户菜单
    userMenus?: IUserMenu[]

    // Map config (e.g. Baidu Map)
    map?: {
      // 百度地图 AK
      baiduAk?: string
      // 天地图 TK
      tiandituTk?: string
      [key: string]: any
    }
  }
}
