import type { RouteRecordRaw } from 'vue-router'
import type { IAuthProvider } from './auth'
import type { IConfigComponent } from './config'
import type { IDataProvider } from './data'
import type { IMenu } from './menu'
import type { IConfigTheme } from './theme'

/**
 * 管理配置
 * 为管理端提供自定义管理服务
 */
export interface IManage {
  name: string // 名称、唯一标识

  title: string // 标题
  copyright?: string // 版权
  description?: string // 描述

  register?: boolean // 注册
  forgotPassword?: boolean // 忘记密码
  updatePassword?: boolean // 更新密码

  apiRoutePath?: string // 接口路由地址

  authProvider?: IAuthProvider // 认证提供者
  dataProvider?: IDataProvider | Record<string, IDataProvider> // 数据提供者

  routePrefix?: string // 路由前缀

  routes?: RouteRecordRaw[] // 路由配置
  menus?: IMenu[] // 菜单配置

  components?: IConfigComponent // 组件配置

  theme?: IConfigTheme // 主题覆盖

  [key: string]: any
}
