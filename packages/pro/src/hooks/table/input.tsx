import type { Component, PropType } from 'vue'
import type { UseTableColumnProps } from './column'
import { useCustomMutation } from '@duxweb/dvha-core'
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
    tag: {
      type: Object as PropType<Component>,
    },
  },
  setup(props) {
    const isEditing = ref(false)
    const inputValue = ref('')

    const { mutateAsync } = useCustomMutation()
    const message = useMessage()

    const saveValue = (v: string) => {
      mutateAsync({
        path: props.path,
        method: 'PATCH',
        payload: {
          [props.field]: v,
        },
      }).then(() => {
        message.success('保存成功')
      }).catch((e) => {
        message.error(e.message)
      })
    }

    return () => {
      return isEditing.value
        ? (
            <div class="flex gap-2">
              <div>
                {h(props.tag || NInput, {
                  'value': inputValue.value,
                  'onUpdate:value': (val: string) => inputValue.value = val,
                  'autofocus': true,
                })}
              </div>
              <NButton
                type="primary"
                onClick={() => {
                  if (inputValue.value !== props.data[props.field]) {
                    saveValue(inputValue.value)
                  }
                  else {
                    isEditing.value = false
                  }
                }}
                renderIcon={() => <div class="size-4 i-tabler:check"></div>}
              >
              </NButton>
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
          tag={props.tag}
        />
      )
    }
  }

  return {
    render,
  }
}
