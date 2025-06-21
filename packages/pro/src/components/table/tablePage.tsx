import type { DataTableProps } from 'naive-ui'
import type { PropType, SlotsType } from 'vue'
import type { TablePageSlotProps } from '../layout/table'
import { NDataTable } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { DuxTableLayout } from '../layout/table'

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
  }>,
  setup(props, { slots }) {
    const tableProps = computed(() => {
      const { tableProps, ...rest } = props
      return rest
    })

    return () => (
      <DuxTableLayout {...tableProps.value}>
        {{
          default: result => (
            <NDataTable
              remote
              class="h-full"
              minHeight={200}
              tableLayout="fixed"
              flexHeight
              rowKey={row => row.id}
              bordered={false}
              scrollX={result.width}
              {...result.table.value}
              {...props.tableProps}
            />
          ),
          bottom: slots?.bottom,
          tools: slots?.tools,
          actions: slots?.actions,
          sideLeft: slots?.sideLeft,
          sideRight: slots?.sideRight,
        }}
      </DuxTableLayout>
    )
  },
})
