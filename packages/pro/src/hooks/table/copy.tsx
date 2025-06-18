import { useClipboard } from '@vueuse/core'
import { get } from 'lodash-es'
import { useMessage } from 'naive-ui'

export interface UseTableColumnCopyProps {
  key?: string
}

export function useTableColumnCopy() {
  const message = useMessage()
  const { copy } = useClipboard()

  const render = (props: UseTableColumnCopyProps) => {
    return (rowData: Record<string, any>, _rowIndex: number) => {
      const value = get(rowData, props.key || '')

      return (
        <div class="flex">
          {value && value !== '-'
            ? (
                <div
                  class="flex justify-start items-center gap-1"

                >
                  <div>
                    {value}
                  </div>
                  <div
                    class="cursor-pointer i-tabler:copy size-4 text-muted hover:text-primary"
                    onClick={() => {
                      copy(value).then(() => message.success('复制成功')).catch(() => message.error('复制失败'))
                    }}
                  />
                </div>
              )
            : '-'}
        </div>
      )
    }
  }

  return {
    render,
  }
}
