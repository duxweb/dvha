import type { UseTableColumnProps } from './column'
import { useCustomMutation } from '@duxweb/dvha-core'
import { get } from 'lodash-es'
import { NSwitch, useMessage } from 'naive-ui'

export interface useTableColumnSwitchProps {
  key?: string
}

export function useTableColumnSwitch(columnProps?: UseTableColumnProps) {
  const { mutateAsync } = useCustomMutation()
  const message = useMessage()

  const render = (props: useTableColumnSwitchProps) => {
    return (rowData: Record<string, any>, _rowIndex: number) => {
      const rowKey = props.key || 'status'
      const path = typeof columnProps?.path === 'function' ? columnProps?.path(rowData) : `${columnProps?.path}/${get(rowData, columnProps?.rowKey || 'id')}`
      return (
        <NSwitch
          value={!!rowData[rowKey]}
          onUpdateValue={(v) => {
            rowData[rowKey] = v
            mutateAsync({
              path,
              method: 'PATCH',
              payload: {
                [rowKey]: v,
              },
            }).then(() => {
              rowData[rowKey] = v
            }).catch((e) => {
              rowData[rowKey] = !v
              message.error(e.message)
            })
          }}
        />
      )
    }
  }

  return {
    render,
  }
}
