import type { TableColumn, TablePagination } from '@duxweb/dvha-naiveui'
import type { MaybeRef, PropType } from 'vue'
import { useI18n } from '@duxweb/dvha-core'
import { useWindowSize } from '@vueuse/core'
import { NDataTable, NPagination } from 'naive-ui'
import { computed, defineComponent, unref } from 'vue'
import { useTable } from '../../hooks'
import { DuxListEmpty } from '../status'

export const DuxTable = defineComponent({
  name: 'DuxTable',
  props: {
    path: {
      type: String,
      required: true,
    },
    filter: {
      type: Object as PropType<MaybeRef<Record<string, any>>>,
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
    },
    pagination: {
      type: [Boolean, Object] as PropType<boolean | TablePagination>,
      default: true,
    },
  },
  extends: NDataTable,
  setup(props, { expose }) {
    const tableProps = computed(() => {
      const { path, filter, columns, pagination, ...rest } = props
      return rest
    })

    const filters = computed(() => unref(props.filter) || {})

    const result = useTable({
      path: props.path,
      filters,
      columns: props.columns || [],
      pagination: props.pagination,
    })

    expose(result)

    const { width } = useWindowSize()
    const { t } = useI18n()

    return () => (
      <div class="flex flex-col gap-2">
        <NDataTable
          {...tableProps.value}
          {...result.table.value}
          class="flex-1 min-h-0"
          minHeight={200}
          tableLayout="fixed"
          flexHeight
          rowKey={row => row.id}
          bordered={false}
          renderCell={(value) => {
            return value === undefined || value === null || value === '' ? '-' : value
          }}
        >
          {{
            empty: () => <DuxListEmpty bordered={false} />,
          }}
        </NDataTable>
        {props.pagination && (
          <div class="flex justify-end p-4 border-t border-muted">
            <NPagination
              {...result.tablePagination.value}
              simple={width.value < 768}
            >
              {{
                prefix: () => (
                  <div>
                    {t('components.list.total', {
                      total: result.total.value || 0,
                    })}
                  </div>
                ),
              }}
            </NPagination>
          </div>
        )}
      </div>
    )
  },
})
