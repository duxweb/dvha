import type { PropType } from 'vue'
import { NDataTable, NPagination } from 'naive-ui'
import { computed, defineComponent, toRef } from 'vue'
import { DuxListEmpty } from '../status'
import { useTable } from '../../hooks'
import { TableColumn, TablePagination } from '@duxweb/dvha-naiveui'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from '@duxweb/dvha-core'

export const DuxTable = defineComponent({
  name: 'DuxTable',
  props: {
    path: {
      type: String,
      required: true,
    },
    filter: {
      type: Object as PropType<Record<string, any>>,
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
  setup(props) {
    const tableProps = computed(() => {
      const { path, filter, columns, pagination, ...rest } = props
      return rest
    })

    const filters = toRef(props.filter || {})

    const result = useTable({
      path: props.path,
      filters: filters.value,
      columns: props.columns || [],
      pagination: props.pagination,
    })

    const { width } = useWindowSize()
    const { t } = useI18n()



    return () => (
      <div class='flex flex-col'>
        <NDataTable
        {...tableProps.value}
        {...result.table.value}
        class="flex-1 min-h-0"
        minHeight={200}
        tableLayout="fixed"
        flexHeight
        rowKey={row => row.id}
        bordered={false}
      >
        {{
          empty: () => <DuxListEmpty bordered={false} />,
        }}
      </NDataTable>
      {props.pagination && (<div class='flex justify-end'>
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
      </div>)}
      </div>
    )
  },
})
