import type { RouteRecordRaw } from 'vue-router'
import type { IAuthProvider } from './auth'
import type { IDataProvider } from './data'
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
  // 全局接口地址
  apiUrl?: string
  // 默认语言
  lang?: string
  // 扩展配置
  extends?: Record<string, any>

  // 管理端提供者
  manages?: IManage[]
  // 全局认证提供者
  authProvider?: IAuthProvider
  // 全局数据提供者
  dataProvider?: IDataProvider

  // 路由配置
  routes?: RouteRecordRaw[]
  // 全局主题
  theme?: IConfigTheme

  [key: string]: any
}
