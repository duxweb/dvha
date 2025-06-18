import { findKey, get } from 'lodash-es'
import { NTag } from 'naive-ui'

export type ColumnStatusType = 'success' | 'error' | 'warning' | 'info' | 'default'

export interface ColumnStatusTypeValue {
  label?: string
  value?: any
}

export interface useTableColumnStatusProps {
  key?: string
  maps?: Partial<Record<ColumnStatusType, ColumnStatusTypeValue>>
}

export function useTableColumnStatus() {
  const render = (props: useTableColumnStatusProps) => {
    return (rowData: Record<string, any>, _rowIndex: number) => {
      const key = props?.key || 'status'

      const type = findKey(props.maps, (v) => {
        if (!v) {
          return false
        }
        return key ? v?.value === get(rowData, key) : 'default'
      }) as ColumnStatusType | undefined

      const item = type ? props.maps?.[type] : undefined

      return item
        ? (
            <NTag round bordered={true} type={type}>
              {{
                icon: () => {
                  return (
                    <>
                      {type === 'success' && <div class="n-icon i-tabler:circle-check-filled"></div>}
                      {type === 'error' && <div class="n-icon i-tabler:circle-x-filled"></div>}
                      {type === 'warning' && <div class="n-icon i-tabler:exclamation-circle-filled"></div>}
                      {(type === 'default' || type === 'info') && <div class="n-icon i-tabler:info-circle-filled"></div>}
                    </>
                  )
                },
                default: () => <span class="text-sm">{item?.label}</span>,
              }}
            </NTag>
          )
        : null
    }
  }

  return {
    render,
  }
}
