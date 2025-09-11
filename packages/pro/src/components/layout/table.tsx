import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { TableColumn, TablePagination, UseNaiveTableReturn, UseTableProps } from '@duxweb/dvha-naiveui'
import type { DataTableBaseColumn, SelectOption, TabsInst } from 'naive-ui'
import type { PropType } from 'vue'
import type { UseActionItem } from '../../hooks'
import type { DuxToolOptionItem } from './tools'
import { useI18n, useJsonSchema, useTabStore } from '@duxweb/dvha-core'
import { useWindowSize } from '@vueuse/core'
import { NButton, NDrawer, NPagination, NPopselect, NProgress, NTab, NTabs, NTooltip } from 'naive-ui'
import { computed, defineComponent, h, nextTick, onMounted, reactive, ref, toRef, watch } from 'vue'
import { useAction, useTable } from '../../hooks'
import { DuxPage } from '../../pages'
import { DuxDrawerPage } from '../drawer'

import { DuxTableFilter } from './filter'

import { DuxTableTools } from './tools'

export interface TablePageTools {
  import?: boolean
  export?: boolean
  refresh?: boolean
}

export interface TablePageSlotProps extends UseNaiveTableReturn {
  width: number
}

export const DuxTableLayout = defineComponent({
  name: 'DuxTableLayout',
  props: {
    path: {
      type: String,
      required: true,
    },
    filter: {
      type: Object as PropType<Record<string, any>>,
    },
    filterSchema: {
      type: Array as PropType<JsonSchemaNode[]>,
    },
    filterNumber: {
      type: Number,
      default: 1,
    },
    sorter: {
      type: Object as PropType<Record<string, any>>,
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
    },
    pagination: {
      type: [Boolean, Object] as PropType<boolean | TablePagination>,
      default: true,
    },
    tabs: {
      type: Array as PropType<{
        label: string
        value: string | number
      }[]>,
    },
    actions: {
      type: Array as PropType<UseActionItem[]>,
      default: () => [],
    },
    tools: {
      type: Object as PropType<TablePageTools>,
    },
    sideLeftTitle: {
      type: String,
      default: '',
    },
    sideRightTitle: {
      type: String,
      default: '',
    },
    batchOptions: {
      type: Array as PropType<DuxToolOptionItem[]>,
    },
    hookTableProps: {
      type: Object as PropType<Partial<UseTableProps>>,
    },
  },
  setup(props, { slots, expose }) {
    const filters = toRef(props, 'filter', {})
    const sorters = toRef(props, 'sorter', {})
    const tableColumns = toRef(props, 'columns', [])
    const { t } = useI18n()
    const { renderAction } = useAction()

    const result = useTable({
      ...props.hookTableProps,
      path: props.path,
      filters: filters.value,
      sorters: sorters.value,
      columns: tableColumns,
      pagination: props.pagination,
    })

    expose(result)

    const { columns, tablePagination, table, onUpdateColumnSelected, onUpdateChecked, columnSelected, autoRefetch, autoCountdown, onAutoRefetch, isExporting, isExportingRows, isImporting, onExport, onExportRows, onImport } = result

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
        return acc + (Number(column?.width) || Number(column?.minWidth) || 110)
      }, 0)
      return width
    })

    const sideLeft = reactive({
      show: false,
    })

    const sideRight = reactive({
      show: false,
    })
    // Mobile filter visibility toggle
    const mobileFiltersShow = ref(false)

    const filterSchema = computed(() => {
      return (props.filterSchema || []).map((item) => {
        const { label, ...rest } = item
        return {
          tag: DuxTableFilter,
          attrs: {
            label,
          },
          children: rest,
        }
      })
    })

    const { render: filterRenderCollapse } = useJsonSchema({
      data: computed(() => filterSchema.value),
    })

    const tools = computed(() => {
      return {
        import: false,
        export: true,
        refresh: true,
        ...props.tools,
      }
    })

    const tabsInstRef = ref<TabsInst | null>(null)

    watch(
      () => props.tabs?.map(t => t.value),
      () => {
        const values = props.tabs?.map(t => t.value) || []
        if (filters.value?.tab === undefined) {
          const first = values[0]
          if (first !== undefined) {
            filters.value.tab = first
          }
        }
        nextTick(() => tabsInstRef.value?.syncBarPosition())
      },
      { deep: true },
    )

    // 当窗口宽度变化时，同步一次指示条位置，避免断行/滚动后偏移
    watch(() => width.value, () => {
      nextTick(() => tabsInstRef.value?.syncBarPosition())
    })

    const tab = useTabStore()

    const tabInfo = tab.tabs.find(v => v.path === tab.current)

    const activeTab = computed(() => {
      const values = props.tabs?.map(t => t.value) || []
      const current = filters.value?.tab
      return values.includes(current as any) ? current : values[0]
    })

    onMounted(() => {
      nextTick(() => tabsInstRef.value?.syncBarPosition())
    })

    return () => (
      <DuxPage actions={props.actions} scrollbar={false}>
        {{
          sideLeft: () => slots?.sideLeft && width.value >= 1024 ? slots?.sideLeft?.() : undefined,
          sideRight: () => slots?.sideRight && width.value >= 1024 ? slots?.sideRight?.() : undefined,
          default: () => (
            <div class="flex flex-col gap-3 h-full relative">
              <div class="flex gap-2 justify-between flex-row border-b border-muted">
                <div class="relative top-1.5px">
                  {!props.tabs && <div class="pt-1 text-base">{tabInfo?.label}</div>}
                  {props.tabs && (
                    <NTabs
                      ref={tabsInstRef}
                      type="bar"
                      size="small"
                      style={{
                        '--n-tab-padding': '5px 20px 15px 20px',
                        '--n-tab-gap': '20px',
                      }}
                      default-value={props.tabs?.[0]?.value || ''}
                      value={activeTab.value}
                      onUpdateValue={(v) => {
                        filters.value.tab = v
                        nextTick(() => tabsInstRef.value?.syncBarPosition())
                      }}
                    >
                      {props.tabs?.map(tab => (
                        <NTab name={tab.value} tab={tab.label} />
                      ))}
                    </NTabs>
                  )}
                </div>
                <div class="flex gap-2 justify-end pb-2">
                  {slots.actions?.()}

                  {props.actions?.length > 0 && renderAction({
                    type: width.value < 1024 ? 'dropdown' : 'button',
                    items: props.actions,
                  })}
                </div>
              </div>

              <div class="flex gap-2 justify-between flex-col-reverse lg:flex-row items-stretch lg:items-start">

                {(width.value >= 1024 || mobileFiltersShow.value) && (
                  <div
                    class={[
                      'flex-1 flex flex-col lg:flex-row gap-2 flex-wrap',
                    ]}
                  >
                    {h(filterRenderCollapse)}

                  </div>
                )}

                <div class="flex justify-between gap-2">
                  <div class={[
                    'flex-1 flex gap-2',
                  ]}
                  >
                    {slots?.sideLeft && width.value < 1024 && (
                      <NButton
                        class="flex-none"
                        secondary
                        onClick={() => {
                          sideLeft.show = !sideLeft.show
                        }}
                      >
                        {{
                          icon: () => <div class="i-tabler:layout-sidebar-inactive size-4" />,
                        }}
                      </NButton>
                    )}

                    {slots?.sideRight && width.value < 1024 && (
                      <NButton
                        class="flex-none"
                        secondary
                        onClick={() => {
                          sideRight.show = !sideRight.show
                        }}
                      >
                        {{
                          icon: () => <div class="i-tabler:layout-sidebar-right-inactive size-4" />,
                        }}
                      </NButton>
                    )}

                    <div class="flex-none lg:hidden">
                      <NButton
                        secondary
                        onClick={() => {
                          mobileFiltersShow.value = !mobileFiltersShow.value
                        }}
                      >
                        {{
                          icon: () => <div class="i-tabler:filter size-4" />,
                        }}
                      </NButton>
                    </div>
                  </div>

                  <div class="flex gap-2 items-center">

                    {slots?.tools?.()}

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
                            <NButton secondary icon-placement="right">
                              {{
                                icon: () => <div class="i-tabler:columns size-4" />,
                              }}
                            </NButton>
                          ),
                          default: () => t('components.list.columnSetting'),
                        }}
                      </NTooltip>
                    </NPopselect>

                    {tools.value.export && (
                      <NTooltip>
                        {{
                          trigger: () => (
                            <NButton secondary loading={isExporting.value} onClick={onExport}>
                              {{
                                icon: () => <div class="i-tabler:database-export size-4" />,
                              }}
                            </NButton>
                          ),
                          default: () => t('components.button.export'),
                        }}
                      </NTooltip>
                    )}
                    {tools.value.import && (
                      <NTooltip>
                        {{
                          trigger: () => (
                            <NButton secondary loading={isImporting.value} onClick={onImport}>
                              {{
                                icon: () => <div class="i-tabler:database-import size-4" />,
                              }}
                            </NButton>
                          ),
                          default: () => t('components.button.import'),
                        }}
                      </NTooltip>
                    )}
                    {tools.value.refresh && (
                      <NTooltip>
                        {{
                          trigger: () => (
                            <NButton secondary onClick={onAutoRefetch}>
                              {{
                                icon: () => (
                                  autoRefetch.value
                                    ? (
                                        <NProgress class="size-4" type="circle" percentage={autoCountdown.value * 10} strokeWidth={20} color="rgba(var(--ui-color-primary))">
                                          <span class="text-8px">{autoCountdown.value}</span>
                                        </NProgress>
                                      )
                                    : <div class="i-tabler:refresh size-4" />
                                ),
                              }}
                            </NButton>
                          ),
                          default: () => t('components.button.autoRefresh'),
                        }}
                      </NTooltip>
                    )}
                  </div>

                </div>
              </div>

              {slots?.header?.()}
              <div class="flex-1 min-h-0">
                {slots?.default?.({
                  ...result,
                  width: tableWidth.value,
                })}
              </div>
              <div class="flex justify-between">
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
                            {t('components.list.total', {
                              total: result.total.value || 0,
                            })}
                          </div>
                        ),
                      }}
                    </NPagination>
                  )}
                </div>
              </div>
              <DuxTableTools
                isLoading={result.isBatching.value}
                onBatch={result.onBatch}
                selecteds={table.value.checkedRowKeys}
                number={table.value.checkedRowKeys?.length || 0 || 0}
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
                      label: t('components.button.export'),
                      icon: 'i-tabler:file-export',
                      loading: isExportingRows.value,
                      onClick: onExportRows,
                    },
                    ...props.batchOptions || [],
                  ],
                ]}
              />

              <NDrawer
                show={sideLeft.show}
                onUpdateShow={v => sideLeft.show = v}
                autoFocus={false}
                placement="left"
              >
                <DuxDrawerPage title={props.sideLeftTitle || t('components.button.sideLeft')} onClose={() => sideLeft.show = false} scrollbar={false}>
                  {slots?.sideLeft?.()}
                </DuxDrawerPage>
              </NDrawer>

              <NDrawer
                show={sideRight.show}
                onUpdateShow={v => sideRight.show = v}
                autoFocus={false}
                placement="right"
              >
                <DuxDrawerPage title={props.sideRightTitle || t('components.button.sideRight')} onClose={() => sideRight.show = false} scrollbar={false}>
                  {slots?.sideRight?.()}
                </DuxDrawerPage>
              </NDrawer>
            </div>
          ),
        }}
      </DuxPage>
    )
  },
})
