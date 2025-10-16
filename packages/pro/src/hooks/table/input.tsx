import type { IDataProviderCustomOptions } from '@duxweb/dvha-core'
import type { Component, PropType } from 'vue'
import type { UseTableColumnProps } from './column'
import { useCustomMutation, useI18n } from '@duxweb/dvha-core'
import { get } from 'lodash-es'
import { NButton, NInput, useMessage } from 'naive-ui'
import { defineComponent, h, ref } from 'vue'

const TableColumnInput = defineComponent({
  name: 'TableColumnInput',
  props: {
    data: {
      type: Object,
      required: true,
    },
    field: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      required: true,
    },
    params: {
      type: [Object, Function] as PropType<Record<string, any> | (() => Record<string, any>)>,
    },
    meta: {
      type: [Object, Function] as PropType<IDataProviderCustomOptions | (() => IDataProviderCustomOptions)>,
    },
    tag: {
      type: Object as PropType<Component>,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const isEditing = ref(false)
    const inputValue = ref('')
    const isSaving = ref(false)

    const { mutateAsync } = useCustomMutation()
    const message = useMessage()

    const saveValue = (v: string) => {
      if (isSaving.value)
        return
      isSaving.value = true
      const resolvedMeta: IDataProviderCustomOptions = typeof props.meta === 'function'
        ? (props.meta as any)()
        : (props.meta || {})

      const resolvedParams = typeof props.params === 'function'
        ? (props.params as any)()
        : props.params

      const options: IDataProviderCustomOptions = {
        ...resolvedMeta,
        path: props.path,
        method: 'PATCH',
        payload: { [props.field]: v },
      }

      if (resolvedParams) {
        options.query = { ...(resolvedMeta?.query || {}), ...resolvedParams }
      }

      mutateAsync(options).then(() => {
        message.success(t('hooks.table.saveSuccess') as string)
        props.data[props.field] = v
        isEditing.value = false
      }).catch((e) => {
        message.error(e.message)
      }).finally(() => {
        isSaving.value = false
      })
    }

    return () => {
      return isEditing.value
        ? (
            <div class="flex gap-2">
              {h(props.tag || NInput, {
                'value': inputValue.value,
                'onUpdate:value': (val: string) => inputValue.value = val,
                'autofocus': true,
                'disabled': isSaving.value,
              }, {
                suffix: () => (
                  isSaving.value
                    ? <div class="n-icon i-tabler:loader-2 animate-spin" />
                    : (
                        <>
                          <NButton
                            text
                            type="primary"
                            disabled={isSaving.value}
                            onClick={() => {
                              if (inputValue.value !== props.data[props.field]) {
                                saveValue(inputValue.value)
                              }
                              else {
                                isEditing.value = false
                              }
                            }}
                            renderIcon={() => <div class="size-4 i-tabler:check"></div>}
                          />
                          <NButton
                            text
                            type="error"
                            disabled={isSaving.value}
                            onClick={() => { isEditing.value = false }}
                            renderIcon={() => <div class="size-4 i-tabler:x"></div>}
                          />
                        </>
                      )
                ),
              })}
            </div>
          )
        : (
            <div class="flex">
              <div
                class="flex justify-start items-center gap-1"

              >
                <div>
                  {props.data[props.field] === undefined || props.data[props.field] === '' ? '-' : props.data[props.field]}
                </div>
                <div
                  class="cursor-pointer i-tabler:pencil size-4 text-muted hover:text-primary"
                  onClick={() => {
                    inputValue.value = props.data[props.field]
                    isEditing.value = true
                  }}
                />
              </div>
            </div>
          )
    }
  },
})

export interface UseTableColumnInputProps {
  key?: string
  tag?: Component
  params?: Record<string, any> | (() => Record<string, any>)
  meta?: IDataProviderCustomOptions | (() => IDataProviderCustomOptions)
}

export function useTableColumnInput(columnProps?: UseTableColumnProps) {
  const render = (props: UseTableColumnInputProps) => {
    return (rowData: Record<string, any>, _rowIndex: number) => {
      const path = typeof columnProps?.path === 'function' ? columnProps?.path(rowData) : `${columnProps?.path}/${get(rowData, columnProps?.rowKey || 'id')}`

      return (
        <TableColumnInput
          data={rowData}
          field={props.key}
          path={path}
          params={props.params}
          meta={props.meta}
          tag={props.tag}
        />
      )
    }
  }

  return {
    render,
  }
}
