import type { DropdownOption } from 'naive-ui'
import type { VNodeChild } from 'vue'
import type {
  UseActionProps,
  UseActionRenderProps,
  UseActionTarget,
} from './table/index'
import { useCustomMutation, useDelete, useI18n, useManage } from '@duxweb/dvha-core'
import { NButton, NDropdown, useMessage } from 'naive-ui'
import { h } from 'vue'
import { useRouter } from 'vue-router'
import { useDialog } from './dialog'
import { useDrawer } from './drawer'
import { useModal } from './modal'

export function useAction(action?: UseActionProps) {
  const modal = useModal()
  const drawer = useDrawer()
  const dialog = useDialog()
  const { t } = useI18n()
  const message = useMessage()
  const manage = useManage()
  const router = useRouter()

  const mutation = useCustomMutation({
    onSuccess: (data) => {
      message.success(data.message || (t('common.success') as string))
    },
    onError: (error) => {
      message.error(error.message || (t('common.error') as string))
    },
  })

  const deleteMutation = useDelete({
    onSuccess: (data) => {
      message.success(data.message || (t('common.success') as string))
    },
    onError: (error) => {
      message.error(error.message || (t('common.error') as string))
    },
  })

  const actionPath = action?.path || manage.getPath()

  const target = (props: UseActionTarget) => {
    const title = t(props.item.title || '', {}, props.item.title)
    const label = t(props.item.label || '', {}, props.item.label)

    if (props.item.type === 'modal') {
      const item = props.item
      const componentProps = typeof item.componentProps === 'function' ? item.componentProps(props.data) : item.componentProps
      modal.show({
        title: title || label,
        component: item.component,
        componentProps: {
          id: props.id,
          ...componentProps,
        },
        width: item.width,
        draggable: item.draggable !== undefined ? item.draggable : true,
      })
    }

    if (props.item.type === 'drawer') {
      const item = props.item
      const componentProps = typeof item.componentProps === 'function' ? item.componentProps(props.data) : item.componentProps
      drawer.show({
        title: title || label,
        component: item.component,
        componentProps: {
          id: props.id,
          ...componentProps,
        },
        width: item.width,
        maxWidth: item.maxWidth,
      })
    }

    if (props.item.type === 'confirm') {
      const item = props.item
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
      const item = props.item
      dialog.confirm({
        title: title || label,
        content: item.content,
      }).then(() => {
        const data = typeof item.data === 'function' ? item.data(props.id, props.data) : item.data
        const methodName = (item.method || 'post').toLowerCase()
        const path = typeof item.path === 'function' ? item.path(props.id, props.data) : item.path || actionPath
        mutation.mutate({
          path,
          method: methodName,
          payload: data,
        })
      })
    }

    if (props.item.type === 'delete') {
      const item = props.item
      dialog.confirm({
        title: title || label,
        content: item.content,
      }).then(() => {
        deleteMutation.mutate({
          id: props.id as string,
          path: typeof item.path === 'function' ? item.path(props.id, props.data) : item.path || actionPath,
        })
      })
    }

    if (props.item.type === 'link') {
      const item = props.item
      const path = typeof item.path === 'function' ? manage.getRoutePath(item.path?.(props.id, props.data)) : manage.getRoutePath(props.id ? `${item.path || actionPath}${props.data === undefined ? '' : `/${props.id}`}` : item.path || actionPath)
      router.push(path)
    }

    if (props.item.type === 'callback') {
      const item = props.item
      item.callback?.(props.id, props.data)
    }
  }

  const button = useActionButton()
  const dropdown = useActionDropdown()

  const renderTable = (actionRender: UseActionProps): ((rowData: Record<string, any>, rowIndex: number) => VNodeChild) => {
    return (rowData: Record<string, any>, rowIndex: number) => {
      const props = {
        id: rowData[actionRender.key || action?.key || 'id'],
        data: rowData,
        index: rowIndex,
        target,
        text: actionRender.text !== undefined ? actionRender.text : action?.text || false,
        align: actionRender.align !== undefined ? actionRender.align : action?.align || 'left',
      }

      return (actionRender.type || action?.type) === 'button'
        ? button.render({ ...props, action: actionRender || action })
        : dropdown.render({ ...props, action: actionRender || action })
    }
  }

  const renderAction = (actionRender: UseActionProps): VNodeChild => {
    const props = {
      target,
      text: actionRender.text !== undefined ? actionRender.text : action?.text || false,
      align: actionRender.align !== undefined ? actionRender.align : action?.align || 'left',
    }

    return (actionRender.type || action?.type) === 'button'
      ? button.render({ ...props, action: actionRender || action })
      : dropdown.render({ ...props, action: actionRender || action })
  }

  return {
    target,
    renderTable,
    renderAction,
  }
}

export function useActionButton() {
  const { t } = useI18n()

  const render = (props: UseActionRenderProps) => {
    const items = props.action.items?.filter(item => !item.show || item.show?.(props.data, props.index)).map((item, index) => {
      return h(NButton, {
        key: index,
        type: item.color || (item.type === 'delete' ? 'error' : 'primary'),
        text: props.text,
        secondary: !props.text,
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
      class: ['flex gap-2 flex-wrap items-center', props.align === 'right' ? 'justify-end' : props.align === 'center' ? 'justify-center' : 'justify-start'],
    }, items)
  }

  return {
    render,
  }
}

export function useActionDropdown() {
  const { t } = useI18n()

  const render = (props: UseActionRenderProps) => {
    const options: DropdownOption[] = props.action.items?.filter(item => !item.show || item.show?.(props.data, props.index)).map((item, index) => {
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
    }, () => [
      h('div', {
        class: [
          'flex items-center',
          props.align === 'right' ? 'justify-end' : props.align === 'center' ? 'justify-center' : 'justify-start',
        ],
      }, h(NButton, {
        type: 'default',
        text: props.text,
        secondary: !props.text,
        renderIcon: () => h('div', {
          class: ['n-icon', 'i-tabler:dots-vertical'],
        }),
      })),
    ])
  }

  return {
    render,
  }
}
