import { useI18n } from '@duxweb/dvha-core'
import { useClipboard } from '@vueuse/core'
import { get } from 'lodash-es'
import { useMessage } from 'naive-ui'

export interface UseTableColumnCopyProps {
  key?: string
}

export function useTableColumnCopy() {
  const { t } = useI18n()
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
                      copy(value).then(() => message.success(t('hooks.table.copySuccess') as string)).catch(() => message.error(t('hooks.table.copyFailed') as string))
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
