import type { DataTableProps } from 'naive-ui'
import type { PropType, SlotsType } from 'vue'
import type { TablePageSlotProps } from '../layout/table'
import { NDataTable } from 'naive-ui'
import { computed, defineComponent, ref } from 'vue'
import { DuxTableLayout } from '../layout/table'
import { DuxListEmpty } from '../status'

export const DuxTablePage = defineComponent({
  name: 'DuxTablePage',
  props: {
    tableProps: {
      type: Object as PropType<DataTableProps>,
    },
  },
  extends: DuxTableLayout,
  slots: Object as SlotsType<{
    default: (props: TablePageSlotProps) => any
    bottom: () => any
    tools: () => any
    actions: () => any
    sideLeft: () => any
    sideRight: () => any
    header: () => any
  }>,
  setup(props, { slots, expose }) {
    const tableLayoutRef = ref()

    const tableProps = computed(() => {
      const { tableProps, ...rest } = props
      return rest
    })

    expose({
      table: tableLayoutRef,
    })

    return () => (
      <DuxTableLayout ref={tableLayoutRef} {...tableProps.value}>
        {{
          default: result => (
            <NDataTable
              {...result.table.value}
              {...props.tableProps}
              class="h-full"
              minHeight={200}
              tableLayout="fixed"
              flexHeight
              rowKey={row => row.id}
              bordered={false}
              scrollX={result.width}
              renderCell={(value) => {
                return value === undefined || value === null || value === '' ? '-' : value
              }}
            >
              {{
                empty: () => <DuxListEmpty bordered={false} />,
              }}
            </NDataTable>
          ),
          bottom: slots?.bottom,
          tools: slots?.tools,
          actions: slots?.actions,
          sideLeft: slots?.sideLeft,
          sideRight: slots?.sideRight,
          header: slots?.header,
        }}
      </DuxTableLayout>
    )
  },
})
