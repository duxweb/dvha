import type { Component } from 'vue'
import type { Options } from 'vue3-sfc-loader'
import type { RouteComponent, RouteRecordRaw } from 'vue-router'
import type { IJsonAdaptor } from '../hooks'
import type { IAuthProvider } from './auth'
import type { IDataProvider } from './data'
import type { I18nProvider } from './i18n'
import type { IManage } from './manage'
import type { IConfigTheme } from './theme'

/**
 * 全局配置
 */
export interface IConfig {
  // 标题
  title?: string
  // 版权
  copyright?: string
  // 描述
  description?: string
  // 默认语言
  lang?: string
  // 扩展配置
  extends?: Record<string, any>
  // 默认管理端
  defaultManage?: string
  // 管理端提供者
  manages: IManage[]
  // 全局认证提供者
  authProvider?: IAuthProvider
  // 全局数据提供者
  dataProvider?: IDataProvider | Record<string, IDataProvider>
  // 全局国际化提供者
  i18nProvider?: I18nProvider
  // 全局布局配置
  components?: IConfigComponent
  // 全局路由配置
  routes?: RouteRecordRaw[]
  // 全局主题
  theme?: IConfigTheme

  // 全局包配置
  remote?: {
    packages?: Options
    apiMethod?: string
    apiRoutePath?: string | ((path: string) => string)
  }

  // 全局 JSON Schema 配置
  jsonSchema?: {
    adaptors?: IJsonAdaptor[]
    components?: Record<string, Component> | Component[]
  }

  [key: string]: any
}

export interface IConfigComponent {
  authLayout?: RouteComponent // 认证布局
  noAuthLayout?: RouteComponent // 未认证布局

  notFound?: RouteComponent // 未找到布局
  notAuthorized?: RouteComponent // 未授权布局
  error?: RouteComponent // 错误布局
  exception?: RouteComponent // 异常布局

  iframe?: RouteComponent // iframe 组件
  remote?: RouteComponent // remote 组件
}
