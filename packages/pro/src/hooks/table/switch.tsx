import type { UseTableColumnProps } from './column'
import { useCustomMutation } from '@duxweb/dvha-core'
import { get } from 'lodash-es'
import { NSwitch, useMessage } from 'naive-ui'
import { defineComponent, ref, watch } from 'vue'

export interface useTableColumnSwitchProps {
  key?: string
  path?: string | ((rowData: Record<string, any>) => string)
}

export function useTableColumnSwitch(columnProps?: UseTableColumnProps) {
  const { mutateAsync } = useCustomMutation()
  const message = useMessage()

  const SwitchCell = defineComponent({
    name: 'DuxTableSwitchCell',
    props: {
      rowData: {
        type: Object as () => Record<string, any>,
        required: true,
      },
      rowKey: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const updating = ref(false)
      const localValue = ref(get(props.rowData, props.rowKey))

      watch(
        () => get(props.rowData, props.rowKey),
        (val) => {
          if (!updating.value) {
            localValue.value = val ?? false
          }
        },
        { immediate: true },
      )

      const handleUpdate = (v: string | number | boolean) => {
        const prev = localValue.value
        localValue.value = v
        updating.value = true
        mutateAsync({
          path: props.path,
          method: 'PATCH',
          payload: {
            [props.rowKey]: v,
          },
        }).catch((e) => {
          localValue.value = prev
          message.error(e.message)
        }).finally(() => {
          updating.value = false
        })
      }

      return () => (
        <NSwitch
          value={localValue.value ?? false}
          disabled={updating.value}
          onUpdateValue={handleUpdate}
        />
      )
    },
  })

  const render = (props: useTableColumnSwitchProps) => {
    return (rowData: Record<string, any>, _rowIndex: number) => {
      const rowKey = props.key || 'status'
      const idKey = columnProps?.rowKey || 'id'
      const rowId = get(rowData, idKey)
      const pathBase = props.path ?? columnProps?.path
      const path = typeof pathBase === 'function'
        ? pathBase(rowData)
        : `${pathBase}/${rowId}`
      if (!pathBase) {
        return null
      }
      return <SwitchCell rowData={rowData} rowKey={rowKey} path={path} />
    }
  }

  return {
    render,
  }
}
