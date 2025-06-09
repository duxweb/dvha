import type { TableColumn } from '@duxweb/dvha-naiveui'
import type { SelectOption } from 'naive-ui'
import type { PropType } from 'vue'
import { useNaiveTable } from '@duxweb/dvha-naiveui'
import { NButton, NButtonGroup, NDataTable, NPagination, NPopselect, NProgress, NTooltip } from 'naive-ui'
import { computed, defineComponent, toRef } from 'vue'
import { useTableExtend } from '../../hooks'
import { DuxTools } from '../tools'

export default defineComponent({
  name: 'DuxTable',
  props: {
    path: {
      type: String,
      required: true,
    },
    filters: {
      type: Object,
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
      required: true,
    },
    pagination: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    const filters = toRef(props.filters || {})

    const { meta, columns, tablePagination, tableProps, onUpdateColumnSelected, onUpdateChecked, columnSelected, dataFilters, refetch } = useNaiveTable({
      path: props.path,
      filters: filters.value,
      columns: props.columns || [],
      pagination: props.pagination,
    })

    const { autoRefetch, countdown, onRefresh, isExporting, isImporting, onExport, onImport } = useTableExtend({
      path: props.path,
      filters: dataFilters,
      get meta() {
        return meta.value
      },
      pageCount: tablePagination.value.pageCount,
      refetch,
    })

    const columnConfig = computed<SelectOption[]>(() => {
      return columns.value.filter(column => column.title).map(column => ({
        label: column.title,
        value: column.key,
      } as SelectOption))
    })

    return () => (
      <div class="flex flex-col gap-3 h-full relative px-3 pt-3">
        <div class="flex gap-2 justify-between">
          <div class="flex gap-2">
            {slots.filters?.()}
          </div>
          <div class="flex gap-2">

            <NButton iconPlacement="right">
              {{
                default: () => '筛选',
                icon: () => <div class="i-tabler:filter size-4" />,
              }}
            </NButton>

            <NButtonGroup>

              <NPopselect
                options={columnConfig.value}
                value={columnSelected.value}
                onUpdateValue={(v) => {
                  onUpdateColumnSelected(v)
                }}
                multiple
                placement="bottom-start"
                trigger="click"
              >
                <NTooltip>
                  {{
                    trigger: () => (
                      <NButton icon-placement="right">
                        {{
                          icon: () => <div class="i-tabler:columns size-4" />,
                        }}
                      </NButton>
                    ),
                    default: () => '列设置',
                  }}
                </NTooltip>
              </NPopselect>

              <NTooltip>
                {{
                  trigger: () => (
                    <NButton loading={isExporting.value} onClick={onExport}>
                      {{
                        icon: () => <div class="i-tabler:database-export size-4" />,
                      }}
                    </NButton>
                  ),
                  default: () => '导出',
                }}
              </NTooltip>
              <NTooltip>
                {{
                  trigger: () => (
                    <NButton loading={isImporting.value} onClick={onImport}>
                      {{
                        icon: () => <div class="i-tabler:database-import size-4" />,
                      }}
                    </NButton>
                  ),
                  default: () => '导入',
                }}
              </NTooltip>
              <NTooltip>
                {{
                  trigger: () => (
                    <NButton onClick={onRefresh}>
                      {{
                        icon: () => (
                          autoRefetch.value
                            ? (
                                <NProgress class="size-4" type="circle" percentage={countdown.value * 10} strokeWidth={20}>
                                  <span class="text-8px">{countdown.value}</span>
                                </NProgress>
                              )
                            : <div class="i-tabler:refresh size-4" />
                        ),
                      }}
                    </NButton>
                  ),
                  default: () => '自动刷新',
                }}
              </NTooltip>
            </NButtonGroup>
          </div>
        </div>
        <div class="flex-1">
          <NDataTable
            remote
            class="h-full"
            minHeight={200}
            tableLayout="fixed"
            flexHeight
            rowKey={row => row.id}
            {...tableProps.value}
          />
        </div>
        <div class="flex justify-between mb-2">
          <div>
            {slots?.bottom?.()}
          </div>
          <div>
            {props.pagination && (
              <NPagination
                {...tablePagination.value}
              >
                {{
                  prefix: () => (
                    <div>
                      {`共 ${meta?.value?.total || 0} 条`}
                    </div>
                  ),
                }}
              </NPagination>
            )}
          </div>
        </div>
        <DuxTools
          number={tableProps.value.checkedRowKeys?.length || 0 || 0}
          group={[
            [
              {
                icon: 'i-tabler:x',
                onClick: () => {
                  onUpdateChecked?.([])
                },
              },
            ],
            [
              {
                label: '导出',
                icon: 'i-tabler:file-export',
              },
              {
                label: '打印',
                icon: 'i-tabler:printer',
              },
              {
                label: '删除',
                icon: 'i-tabler:trash',
              },
            ],
          ]}
        />
      </div>
    )
  },
})
