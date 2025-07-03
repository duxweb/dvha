import { findKey, get } from 'lodash-es'

export type ColumnColorType = 'success' | 'error' | 'warning' | 'info' | 'default'

export interface ColumnColorTypeValue {
  label?: string
  icon?: string
  value?: any
}

export interface useTableColumnColorProps {
  key?: string
  maps?: Partial<Record<ColumnColorType, ColumnColorTypeValue>>
}

export function useTableColumnColor() {
  const render = (props: useTableColumnColorProps) => {
    return (rowData: Record<string, any>, _rowIndex: number) => {
      const key = props?.key || 'status'

      const type = findKey(props.maps, (v) => {
        if (!v) {
          return false
        }
        return key ? v?.value === get(rowData, key) : 'default'
      }) as ColumnColorType | undefined

      const item = type ? props.maps?.[type] : undefined

      return item
        ? (
            <div class={[
              'flex gap-1 items-center',
              `text-${type}`,
            ]}
            >
              {item.icon ? <div class={`size-4 ${item.icon}`}></div> : null}
              <span class="text-sm">{item?.label}</span>
            </div>
          )
        : null
    }
  }

  return {
    render,
  }
}
