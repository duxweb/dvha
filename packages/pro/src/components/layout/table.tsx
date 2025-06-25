import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { TableColumn, TablePagination, UseNaiveTableReturn, UseTableProps } from '@duxweb/dvha-naiveui'
import type { DataTableBaseColumn, SelectOption } from 'naive-ui'
import type { PropType } from 'vue'
import type { UseActionItem } from '../../hooks'
import { useI18n, useJsonSchema } from '@duxweb/dvha-core'
import { useWindowSize } from '@vueuse/core'
import { NButton, NDrawer, NModal, NPagination, NPopselect, NProgress, NTab, NTabs, NTooltip } from 'naive-ui'
import { computed, defineComponent, h, reactive, toRef } from 'vue'
import { useAction, useTable } from '../../hooks'
import { DuxPage } from '../../pages'
import { DuxDrawerPage } from '../drawer'
import { DuxModalPage } from '../modal'
import { DuxTableFilter } from './filter'
import { DuxFilterLayout } from './filterLayout'
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
    hookTableProps: {
      type: Object as PropType<UseTableProps>,
    },
  },
  setup(props, { slots }) {
    const filters = toRef(props, 'filter', {})
    const tableColumns = toRef(props, 'columns', [])
    const { t } = useI18n()
    const { renderAction } = useAction()

    const result = useTable({
      path: props.path,
      filters: filters.value,
      columns: tableColumns,
      pagination: props.pagination,
      ...props.hookTableProps,
    })

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

    const filterOptions = reactive({
      show: false,
    })

    const sideLeft = reactive({
      show: false,
    })

    const sideRight = reactive({
      show: false,
    })

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

    const { render: filterRender } = useJsonSchema({
      data: filterSchema.value?.slice(1),
    })

    const { render: filterRenderCollapse } = useJsonSchema({
      data: filterSchema.value?.slice(0, 1),
    })

    const tools = computed(() => {
      return {
        import: false,
        export: true,
        refresh: true,
        ...props.tools,
      }
    })

    return () => (
      <DuxPage actions={props.actions} scrollbar={false}>
        {{
          sideLeft: () => slots?.sideLeft && width.value >= 1024 ? slots?.sideLeft?.() : undefined,
          sideRight: () => slots?.sideRight && width.value >= 1024 ? slots?.sideRight?.() : undefined,
          default: () => (
            <div class="flex flex-col gap-2 h-full relative">
              <div class="flex gap-2 justify-between flex-col lg:flex-row">
                {props.tabs && (
                  <div class="flex flex-none">

                    <NTabs
                      type="segment"
                      size="small"
                      style={{
                        '--n-tab-padding': '4px 10px',
                      }}
                      default-value={props.tabs?.[0]?.value}
                      value={filters.value?.tab}
                      onUpdateValue={(v) => {
                        filters.value.tab = v
                      }}
                    >
                      {props.tabs?.map(tab => (
                        <NTab name={tab.value} tab={tab.label} />
                      ))}
                    </NTabs>
                  </div>
                )}
                <div class={[
                  'overflow-hidden flex-1 flex gap-2',
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

                  <div
                    class={[
                      'flex-1 lg:flex gap-2 flex-wrap',
                      props.tabs ? 'justify-end' : 'justify-start',
                    ]}
                  >
                    {h(filterRenderCollapse)}
                  </div>

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

                </div>
                <div class="flex gap-2 justify-between lg:justify-end">

                  <div class="flex gap-2 items-center">

                    {filterSchema.value.length > 1 && (
                      <NButton
                        iconPlacement="right"
                        onClick={() => {
                          filterOptions.show = !filterOptions.show
                        }}
                      >
                        {{
                          default: () => t('components.button.filter'),
                          icon: () => (
                            <div class={[
                              'i-tabler:chevrons-down size-4 transition-all',
                            ]}
                            />
                          ),
                        }}
                      </NButton>
                    )}

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
                  <div class="flex gap-2 justify-end">
                    {slots.actions?.()}

                    {props.actions?.length > 0 && renderAction({
                      type: width.value < 1024 ? 'dropdown' : 'button',
                      items: props.actions,
                    })}
                  </div>
                </div>
              </div>
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
                    {
                      label: t('components.button.delete'),
                      type: 'error',
                      icon: 'i-tabler:trash',
                    },
                  ],
                ]}
              />

              <NModal draggable class="bg-white rounded dark:shadow-gray-950/80  dark:bg-gray-800/60 backdrop-blur" show={filterOptions.show} onUpdateShow={v => filterOptions.show = v}>
                {{
                  default: ({ draggableClass }) => {
                    return (
                      <DuxModalPage title={t('components.button.filter')} handle={draggableClass} onClose={() => filterOptions.show = false}>
                        <DuxFilterLayout showLabel labelPlacement="top">
                          {h(filterRender)}
                        </DuxFilterLayout>
                      </DuxModalPage>
                    )
                  },
                }}
              </NModal>

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
