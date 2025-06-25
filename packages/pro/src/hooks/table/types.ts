import type { ButtonProps } from 'naive-ui'
import type { AsyncComponentLoader } from 'vue'

// 基础属性接口
export interface BaseActionItem {
  label?: string
  title?: string
  icon?: string
  color?: ButtonProps['type']
  show?: (rowData?: Record<string, any>, rowIndex?: number) => boolean
}

// 模态框类型
export interface ModalActionItem extends BaseActionItem {
  type: 'modal'
  component: AsyncComponentLoader<any>
  componentProps?: Record<string, any> | ((data: any) => Record<string, any>)
  width?: number
  draggable?: boolean
}

// 抽屉类型
export interface DrawerActionItem extends BaseActionItem {
  type: 'drawer'
  component: AsyncComponentLoader<any>
  componentProps?: Record<string, any> | ((data: any) => Record<string, any>)
  width?: number
  maxWidth?: number
}

// 链接类型
export interface LinkActionItem extends BaseActionItem {
  type: 'link'
  path: string | ((id?: unknown, item?: Record<string, any>) => string)
}

// 确认框类型
export interface ConfirmActionItem extends BaseActionItem {
  type: 'confirm'
  callback: (id?: unknown, item?: Record<string, any>) => void
  content?: string
}

// 请求类型
export interface RequestActionItem extends BaseActionItem {
  type: 'request'
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete'
  path?: string
  data?: Record<string, any> | ((id?: unknown, item?: Record<string, any>) => Record<string, any>)
  content?: string
}

// 删除类型
export interface DeleteActionItem extends BaseActionItem {
  type: 'delete'
  content?: string
  path?: string
}

// 回调类型
export interface CallbackActionItem extends BaseActionItem {
  type: 'callback'
  callback: (id?: unknown, item?: Record<string, any>) => void
}

// 联合类型
export type UseActionItem
  = | ModalActionItem
    | DrawerActionItem
    | LinkActionItem
    | ConfirmActionItem
    | RequestActionItem
    | DeleteActionItem
    | CallbackActionItem

export interface UseActionProps {
  items: UseActionItem[]
  type?: 'button' | 'dropdown'
  align?: 'left' | 'center' | 'right'
  text?: boolean
  path?: string
  key?: string
}

export interface UseActionTarget {
  id?: unknown
  item: UseActionItem
  data?: Record<string, any>
}

export interface UseActionRender {
  id?: unknown
  data?: Record<string, any>
  index?: number
}

export interface UseActionRenderProps {
  action: UseActionProps
  id?: unknown
  index?: number
  data?: Record<string, any>
  text?: boolean
  align?: 'left' | 'center' | 'right'
  target?: (target: UseActionTarget) => void
}
