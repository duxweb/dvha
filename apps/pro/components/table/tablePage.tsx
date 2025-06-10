import type { TableColumn, TablePagination } from '@duxweb/dvha-naiveui'
import type { DataTableBaseColumn, DataTableProps, SelectOption } from 'naive-ui'
import type { PropType } from 'vue'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { NButton, NButtonGroup, NDataTable, NPagination, NPopselect, NProgress, NTab, NTabs, NTooltip } from 'naive-ui'
import { computed, defineComponent, reactive, ref, toRef, watch } from 'vue'
import { useTable } from '../../hooks/table'
import { DuxTableTools } from './tools'

export const DuxTablePage = defineComponent({
  name: 'DuxTablePage',
  props: {
    path: {
      type: String,
      required: true,
    },
    filters: {
      type: Object as PropType<Record<string, any>>,
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
      required: true,
    },
    pagination: {
      type: [Boolean, Object] as PropType<boolean | TablePagination>,
      default: true,
    },
    tableProps: {
      type: Object as PropType<DataTableProps>,
    },
    tabs: {
      type: Array as PropType<{
        label: string
        value: string | number
      }[]>,
    },
  },
  setup(props, { slots }) {
    const filters = toRef(props.filters || {})

    const { meta, columns, tablePagination, tableProps, onUpdateColumnSelected, onUpdateChecked, columnSelected, autoRefetch, countdown, onAutoRefetch, isExporting, isExportingRows, isImporting, onExport, onExportRows, onImport } = useTable({
      path: props.path,
      filters: filters.value,
      columns: props.columns || [],
      pagination: props.pagination,
    })

    const columnConfig = computed<SelectOption[]>(() => {
      return (columns.value as DataTableBaseColumn[]).filter(column => 'title' in column && 'key' in column).map((column) => {
        return {
          label: column.title,
          value: column.key,
        } as SelectOption
      })
    })

    const { width } = useWindowSize()

    const tableWidth = computed(() => {
      const width = columns.value.reduce((acc, column) => {
        return acc + (Number(column?.width) || Number(column?.minWidth) || 100)
      }, 0)
      return width
    })

    const filterOptions = reactive({
      show: false,
      collapse: false,
    })

    const filterEl = ref<HTMLDivElement>()
    const { height: filterHeight } = useElementSize(filterEl)

    watch(filterHeight, (v) => {
      if (v > 35) {
        filterOptions.show = true
      }
      else {
        filterOptions.show = false
      }
    }, { immediate: true, deep: true })

    return () => (
      <div class="flex flex-col gap-2 h-full relative px-2 pt-2">
        <div class="flex gap-2 justify-between flex-col lg:flex-row">
          {props.tabs && (
            <div class="flex flex-none">
              <NTabs
                type="segment"
                size="small"
                style={{
                  '--n-tab-padding': '4px 10px',
                }}
              >
                {props.tabs?.map(tab => (
                  <NTab name={tab.value} tab={tab.label} />
                ))}
              </NTabs>
            </div>
          )}
          <div class={[
            'overflow-hidden flex-1',
            filterOptions.collapse ? 'h-auto' : 'h-8.5',
          ]}
          >
            <div
              ref={filterEl}
              class={[
                'lg:flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 flex-wrap',

                props.tabs ? 'justify-end' : 'justify-start',
              ]}
            >
              {slots.filters?.()}
            </div>
          </div>
          <div class="flex gap-2 justify-between lg:justify-end">

            {filterOptions.show && (
              <NButton
                iconPlacement="right"
                onClick={() => {
                  filterOptions.collapse = !filterOptions.collapse
                }}
              >
                {{
                  default: () => '筛选',
                  icon: () => (
                    <div class={[
                      'i-tabler:chevrons-down size-4 transition-all',
                      filterOptions.collapse ? 'rotate-180' : 'rotate-0',
                    ]}
                    />
                  ),
                }}
              </NButton>
            )}

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
                    <NButton onClick={onAutoRefetch}>
                      {{
                        icon: () => (
                          autoRefetch.value
                            ? (
                                <NProgress class="size-4" type="circle" percentage={countdown.value * 10} strokeWidth={20} color="rgba(var(--ui-color-primary))">
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
        <div class="flex-1 min-h-0">
          <NDataTable
            remote
            class="h-full"
            minHeight={200}
            tableLayout="fixed"
            flexHeight
            rowKey={row => row.id}
            bordered={false}
            scrollX={tableWidth.value}
            {...tableProps.value}
            {...props.tableProps}
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
                simple={width.value < 768}
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
        <DuxTableTools
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
                loading: isExportingRows.value,
                onClick: onExportRows,
              },
              {
                label: '删除',
                type: 'error',
                icon: 'i-tabler:trash',
              },
            ],
          ]}
        />
      </div>
    )
  },
})
