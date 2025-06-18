import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { TableColumn, TablePagination } from '@duxweb/dvha-naiveui'
import type { DataTableBaseColumn, SelectOption } from 'naive-ui'
import type { PropType } from 'vue'
import type { UseActionItem } from '../../hooks'
import { useI18n, useJsonSchema } from '@duxweb/dvha-core'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { NButton, NInput, NPagination, NPopover, NPopselect, NProgress, NTab, NTabs, NTooltip } from 'naive-ui'
import { computed, defineComponent, h, reactive, ref, toRef, watch } from 'vue'
import { useAction, useTable } from '../../hooks'
import { DuxPage } from '../../pages'
import { DuxTableFilter } from './filter'
import { DuxTableTools } from './tools'

export interface TablePageTools {
  import?: boolean
  export?: boolean
  refresh?: boolean
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
  },
  setup(props, { slots }) {
    const filters = toRef(props.filter || {})
    const { t } = useI18n()
    const { renderAction } = useAction()

    const result = useTable({
      path: props.path,
      filters: filters.value,
      columns: props.columns || [],
      pagination: props.pagination,
    })

    const { meta, columns, tablePagination, table, onUpdateColumnSelected, onUpdateChecked, columnSelected, autoRefetch, autoCountdown, onAutoRefetch, isExporting, isExportingRows, isImporting, onExport, onExportRows, onImport } = result

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

    const filterSchema = computed(() => {
      return (props.filterSchema || []).map((item) => {
        const { title, ...rest } = item
        return {
          tag: DuxTableFilter,
          attrs: {
            label: title,
          },
          children: rest,
        }
      })
    })

    const { render: filterRender } = useJsonSchema({
      data: filterSchema.value?.slice(1),
      components: {
        NInput,
      },
    })

    const { render: filterRenderCollapse } = useJsonSchema({
      data: filterSchema.value?.slice(0, 1),
      components: {
        NInput,
      },
    })

    const tools = computed(() => {
      return {
        import: true,
        export: true,
        refresh: true,
        ...props.tools,
      }
    })

    return () => (
      <DuxPage actions={props.actions} scrollbar={false}>
        {{
          default: () => (
            <div class="flex flex-col gap-3 h-full relative ">
              <div class="flex gap-3 justify-between flex-col lg:flex-row">
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
                  'overflow-hidden flex-1',
                  filterOptions.collapse ? 'h-auto' : 'h-8.5',
                ]}
                >
                  <div
                    ref={filterEl}
                    class={[
                      'lg:flex gap-2 flex-wrap',
                      props.tabs ? 'justify-end' : 'justify-start',
                    ]}
                  >
                    {h(filterRenderCollapse)}
                  </div>
                </div>
                <div class="flex gap-2 justify-between lg:justify-end">

                  {filterSchema.value.length > 1 && (

                    <NPopover trigger="click" displayDirective="show">
                      {{
                        trigger: () => (
                          <NButton
                            iconPlacement="right"
                            onClick={() => {
                              filterOptions.collapse = !filterOptions.collapse
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
                        ),
                        default: () => (
                          <div class="flex flex-col gap-2 py-1">
                            {h(filterRender)}
                          </div>
                        ),
                      }}
                    </NPopover>

                  )}

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
                            <NButton icon-placement="right">
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
                            <NButton loading={isExporting.value} onClick={onExport}>
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
                            <NButton loading={isImporting.value} onClick={onImport}>
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
                            <NButton onClick={onAutoRefetch}>
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
                              total: meta?.value?.total || 0,
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
            </div>
          ),
        }}
      </DuxPage>
    )
  },
})
