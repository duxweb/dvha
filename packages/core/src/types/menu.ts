import type { RouteComponent } from 'vue-router'

export interface IMenu {
  // 菜单名称
  label?: string
  // 菜单唯一标识
  name: string
  // 菜单路径
  path?: string
  // 菜单图标
  icon?: string
  // 菜单排序
  sort?: number
  // 父级菜单
  parent?: string
  // 是否隐藏
  hidden?: boolean
  // 菜单加载器 ('iframe' | 'link' | 'component')
  loader?: string
  // 菜单组件
  component?: RouteComponent
  // 菜单元数据 (当 loader 为 'link' 时，可在 meta.url 中设置外部链接地址)
  meta?: Record<string, any>
}
