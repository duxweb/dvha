import type { VNodeChild } from 'vue'
import { get } from 'lodash-es'

export interface ColumnMapTypeValue {
  icon?: string
  label?: string
  key?: string
  render?: (value: any) => VNodeChild
}

export interface useTableColumnMapProps {
  maps?: ColumnMapTypeValue[] | ((rowData: any) => ColumnMapTypeValue[])
}

export function useTableColumnMap() {
  const render = (props: useTableColumnMapProps) => {
    return (rowData: Record<string, any>, _rowIndex: number) => {
      const mapsData = typeof props.maps === 'function' ? props.maps(rowData) : props.maps

      return (
        <div class="flex flex-col gap-1">
          {mapsData?.map(item => (
            <div class="flex gap-2 ">
              <div class="flex text-muted items-center gap-1 whitespace-nowrap">
                {item.icon && (
                  <div class={[
                    'size-4',
                    item.icon,
                  ]}
                  >
                  </div>
                )}
                {item.label}

              </div>
              <div>{item?.render ? item.render(get(rowData, item.key || '')) : get(rowData, item.key || '')}</div>
            </div>
          ))}
        </div>
      )
    }
  }

  return {
    render,
  }
}
