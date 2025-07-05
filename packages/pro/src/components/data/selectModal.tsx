import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { TableColumn } from '@duxweb/dvha-naiveui'
import type { PropType } from 'vue'
import { useI18n, useJsonSchema } from '@duxweb/dvha-core'
import { NButton, NDataTable } from 'naive-ui'
import { computed, defineComponent, h, ref, watch } from 'vue'
import { useTable } from '../../hooks'
import { DuxModalPage } from '../modal'

const Select = defineComponent({
  name: 'Select',
  props: {
    path: String,
    columns: Array<TableColumn>,
    rowKey: {
      type: String,
      default: 'id',
    },
    filterSchema: {
      type: Array as PropType<JsonSchemaNode[]>,
    },
    onConfirm: Function,
    onClose: Function,
  },
  setup(props) {
    const { t } = useI18n()

    const columns = computed<TableColumn[]>(() => {
      return [
        {
          type: 'selection',
          fixed: 'left',
        },
        ...props.columns || [],
      ]
    })

    const filter = ref({})

    const pagination = ref({
      page: 1,
      pageSize: 10,
    })

    const { table: tableProps, list, pageCount, pageSizes, checkeds } = useTable({
      path: props.path || '',
      columns: columns.value || [],
      filters: filter,
      pagination: pagination.value,
    })

    const checkedRowData = ref<Record<string, any>>([])
    watch(checkeds, (ids) => {
      checkedRowData.value = list.value?.filter(item => ids.includes(item[props.rowKey]))
    })

    const json = useJsonSchema({
      data: props.filterSchema || [],
      context: {
        filter: filter.value,
      },
    })

    return () => (
      <DuxModalPage
        title={t('components.data.selectTitle')}
        onClose={() => {
          props.onClose?.()
        }}
      >
        {{
          default: () => (
            <div class="flex flex-col gap-4">
              {props.filterSchema && (
                <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {h(json.render)}
                </div>
              )}
              <NDataTable
                bordered={false}
                maxHeight={400}
                rowKey={row => row[props.rowKey]}
                {...tableProps.value}
                pagination={{
                  page: pagination.value.page,
                  pageSize: pagination.value.pageSize,
                  pageCount: pageCount.value,
                  pageSizes,
                  onUpdatePage: (page) => {
                    pagination.value.page = page
                  },
                  onUpdatePageSize: (pageSize) => {
                    pagination.value.pageSize = pageSize
                  },
                }}
              />
            </div>
          ),
          footer: () => (
            <>
              <NButton onClick={() => {
                props.onClose?.()
              }}
              >
                {t('components.button.cancel')}
              </NButton>
              <NButton
                type="primary"
                onClick={() => {
                  props.onConfirm?.(checkedRowData.value)
                }}
              >
                {t('components.button.select')}
              </NButton>
            </>
          ),
        }}
      </DuxModalPage>
    )
  },
})

export default Select
