import type { ButtonProps, DropdownOption } from 'naive-ui'
import type { AsyncComponentLoader } from 'vue'
import { useCustomMutation, useDelete, useI18n, useInvalidate, useManage } from '@duxweb/dvha-core'
import { NButton, NDropdown, useMessage } from 'naive-ui'
import { h } from 'vue'
import { useRouter } from 'vue-router'
import { useDialog } from './dialog'
import { useDrawer } from './drawer'
import { useModal } from './modal'

// 基础属性接口
interface BaseActionItem {
  label?: string
  title?: string
  icon?: string
  color?: ButtonProps['type']
  show?: (rowData?: Record<string, any>, rowIndex?: number) => boolean
}

// 模态框类型
interface ModalActionItem extends BaseActionItem {
  type: 'modal'
  component: AsyncComponentLoader<any>
  componentProps?: Record<string, any> | ((data: any) => Record<string, any>)
  width?: number
}

// 抽屉类型
interface DrawerActionItem extends BaseActionItem {
  type: 'drawer'
  component: AsyncComponentLoader<any>
  componentProps?: Record<string, any> | ((data: any) => Record<string, any>)
  width?: number
}

// 链接类型
interface LinkActionItem extends BaseActionItem {
  type: 'link'
  path: string | ((id?: unknown, item?: Record<string, any>) => string)
}

// 确认框类型
interface ConfirmActionItem extends BaseActionItem {
  type: 'confirm'
  callback: (id?: unknown, item?: Record<string, any>) => void
  content?: string
}

// 请求类型
interface RequestActionItem extends BaseActionItem {
  type: 'request'
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete'
  data?: Record<string, any> | ((id?: unknown, item?: Record<string, any>) => Record<string, any>)
  content?: string
  invalidate?: string
}

// 删除类型
interface DeleteActionItem extends BaseActionItem {
  type: 'delete'
  content?: string
  invalidate?: string
}

// 回调类型
interface CallbackActionItem extends BaseActionItem {
  type: 'callback'
  callback: (id?: unknown, item?: Record<string, any>) => void
}

// 联合类型
export type UseActionItem =
  | ModalActionItem
  | DrawerActionItem
  | LinkActionItem
  | ConfirmActionItem
  | RequestActionItem
  | DeleteActionItem
  | CallbackActionItem

export interface UseActionProps {
  items: UseActionItem[]
  type?: 'button' | 'dropdown'
  path?: string
}

export interface UseActionTarget {
  id?: unknown
  item: UseActionItem
  data?: Record<string, any>
}

export function useAction(action: UseActionProps) {
  const modal = useModal()
  const drawer = useDrawer()
  const dialog = useDialog()
  const { t } = useI18n()
  const message = useMessage()
  const { invalidate } = useInvalidate()
  const manage = useManage()
  const router = useRouter()

  const actionButton = useActionButton(action)
  const actionDropdown = useActionDropdown(action)

  const mutation = useCustomMutation({
    onSuccess: (data) => {
      if (action.path) {
        invalidate(action.path)
      }
      message.success(data.message || '操作成功')
    },
    onError: (error) => {
      message.error(error.message || '操作失败')
    },
  })

  const deleteMutation = useDelete({
    onSuccess: (data) => {
      if (action.path) {
        invalidate(action.path)
      }
      message.success(data.message || '操作成功')
    },
    onError: (error) => {
      message.error(error.message || '操作失败')
    },
  })

  const target = (props: UseActionTarget) => {
    const title = t(props.item.title || '', {}, props.item.title)
    const label = t(props.item.label || '', {}, props.item.label)

    if (props.item.type === 'modal') {
      const item = props.item as ModalActionItem
      modal.show({
        title: title || label,
        component: item.component,
        componentProps: {
          id: props.id,
          ...item.componentProps,
        },
        width: item.width,
      })
    }

    if (props.item.type === 'drawer') {
      const item = props.item as DrawerActionItem
      drawer.show({
        title: title || label,
        component: item.component,
        componentProps: {
          id: props.id,
          ...item.componentProps,
        },
        width: item.width,
      })
    }

    if (props.item.type === 'confirm') {
      const item = props.item as ConfirmActionItem
      dialog.confirm({
        title: title || label,
        content: item.content,
      }).then((res) => {
        if (res) {
          item.callback?.(props.id, props.data)
        }
      })
    }

    if (props.item.type === 'request') {
      const item = props.item as RequestActionItem
      dialog.confirm({
        title: title || label,
        content: item.content,
      }).then(() => {
        const data = typeof item.data === 'function' ? item.data(props.id, props.data) : item.data
        const methodName = (item.method || 'post').toLowerCase()
        mutation.mutate({
          method: methodName,
          payload: data,
        })
      })
    }

    if (props.item.type === 'delete') {
      const item = props.item as DeleteActionItem
      dialog.confirm({
        title: title || label,
        content: item.content,
      }).then(() => {
        deleteMutation.mutate({
          id: props.id as string,
          path: action.path,
        })
      })
    }

    if (props.item.type === 'link') {
      const item = props.item as LinkActionItem
      const path = typeof item.path === 'function' ? item.path?.(props.id, props.data) : manage.getRoutePath(props.id ? `${item.path}${props.data === undefined ? '' : `/${props.id}`}` : item.path)
      router.push(path)
    }

    if (props.item.type === 'callback') {
      const item = props.item as CallbackActionItem
      item.callback?.(props.id, props.data)
    }
  }

  const render = (props: UseActionRender) => {
    return action.type === 'button'
      ? actionButton.render({
          ...props,
          target,
        })
      : actionDropdown.render({
          ...props,
          target,
        })
  }

  return {
    target,
    render,
  }
}

export interface UseActionRender {
  id?: unknown
  data?: Record<string, any>
  index?: number
}

interface UseActionRenderProps {
  id?: unknown
  index?: number
  data?: Record<string, any>
  text?: boolean
  target?: (target: UseActionTarget) => void
}

export function useActionButton(action: UseActionProps) {
  const { t } = useI18n()

  const render = (props: UseActionRenderProps) => {
    const items = action.items?.filter(item => !item.show || item.show?.(props.data, props.index)).map((item, index) => {
      return h(NButton, {
        key: index,
        type: item.color || item.type === 'delete' ? 'error' : 'primary',
        text: props.text === undefined ? true : props.text,
        onClick: () => {
          props?.target?.({
            id: props.id,
            data: props.data,
            item,
          })
        },
        renderIcon: item.icon
          ? () => h('div', {
              class: ['n-icon', item.icon],
            })
          : undefined,
      }, () => t(item.label || '', {}, item.label))
    })

    return h('div', {
      class: 'flex gap-2 flex-wrap',
    }, items)
  }

  return {
    render,
  }
}

export function useActionDropdown(action: UseActionProps) {
  const { t } = useI18n()

  const render = (props: UseActionRenderProps) => {
    const options: DropdownOption[] = action.items?.filter(item => !item.show || item.show?.(props.data, props.index)).map((item, index) => {
      return {
        label: t(item.label || '', {}, item.label),
        key: index,
        icon: item.icon
          ? () => h('div', {
              class: ['n-icon', item.icon],
            })
          : undefined,
        onSelect: () => {
          props?.target?.({
            id: props.id,
            data: props.data,
            item,
          })
        },
      } as DropdownOption
    })

    return h(NDropdown, {
      trigger: 'click',
      options,
      onSelect: (_key, option: any) => {
        option?.onSelect?.()
      },
    }, [
      h(NButton, {
        type: 'default',
        secondary: true,
        renderIcon: () => h('div', {
          class: ['n-icon', 'i-tabler:dots-vertical'],
        }),
      }),
    ])
  }

  return {
    render,
  }
}
