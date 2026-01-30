import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { TableColumn, TablePagination, UseNaiveTableReturn, UseTableProps } from '@duxweb/dvha-naiveui'
import type { DataTableBaseColumn, SelectOption, TabsInst } from 'naive-ui'
import type { PropType, Ref } from 'vue'
import type { UseActionItem } from '../../hooks'
import type { DuxToolOptionItem } from './tools'
import { useI18n, useJsonSchema, useTabStore } from '@duxweb/dvha-core'
import { useWindowSize } from '@vueuse/core'
import { cloneDeep, isEqual } from 'lodash-es'
import { NButton, NDrawer, NPagination, NPopselect, NProgress, NTab, NTabs, NTooltip } from 'naive-ui'
import { computed, defineComponent, h, nextTick, onMounted, reactive, ref, toRaw, toRef, unref, watch } from 'vue'
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

export type FilterSchemaEntry = JsonSchemaNode | JsonSchemaNode[]

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
      type: Array as PropType<FilterSchemaEntry[] | Ref<FilterSchemaEntry[]>>,
    },
    filterType: {
      type: String as PropType<'simple' | 'multi'>,
      default: 'simple',
    },
    filterReactive: {
      type: Object as PropType<Record<string, any>>,
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
    const reactiveFilters = computed<Record<string, any>>(() => props.filterReactive || {})
    const tableColumns = toRef(props, 'columns', [])
    const { t } = useI18n()
    const { renderAction } = useAction()

    const appliedFilters = reactive({
      ...(filters.value || {}),
    })

    const result = useTable({
      ...props.hookTableProps,
      path: props.path,
      filters: appliedFilters,
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

    const normalizedFilterSchema = computed<FilterSchemaEntry[]>(() => {
      const schema = unref(props.filterSchema)
      return Array.isArray(schema) ? schema : []
    })

    const filterRows = computed(() => {
      return normalizedFilterSchema.value.map((entry, rowIndex) => {
        const items = Array.isArray(entry) ? entry : [entry]
        const nodes = items.map((item, nodeIndex) => {
          const { label, ...rest } = item || {}
          return {
            key: `filter-node-${rowIndex}-${nodeIndex}`,
            label: label ?? (item as any)?.title ?? '',
            schema: rest as JsonSchemaNode,
          }
        })
        return {
          key: `filter-row-${rowIndex}`,
          nodes,
        }
      })
    })
    const hasFilterSchema = computed(() => {
      return filterRows.value.some(row => row.nodes.some(node => Object.keys(node.schema || {}).length > 0))
    })
    const shouldShowFilter = computed(() => Boolean(slots.filter) || hasFilterSchema.value)

    const filterSchemaDefault = computed(() => {
      return filterRows.value.flatMap(row => row.nodes.map(node => ({
        tag: DuxTableFilter,
        attrs: {
          label: node.label,
        },
        children: node.schema,
      })))
    })

    // 简化：不再检测多行，按钮始终按一行布局

    const { render: filterRenderDefault } = useJsonSchema({
      data: computed(() => filterSchemaDefault.value),
    })

    const tools = computed(() => {
      return {
        import: false,
        export: true,
        refresh: true,
        ...props.tools,
      }
    })

    // 重新挂载筛选渲染器用的 key，用于在重置时强制重建表单控件
    const filterRenderKey = ref(0)

    const tabsInstRef = ref<TabsInst | null>(null)

    const cloneFilters = (value?: Record<string, any>) => cloneDeep(toRaw(value) || {})
    const snapshotAppliedFilters = () => cloneDeep(toRaw(appliedFilters) || {})
    const mutateAppliedFilters = (mutator: () => void) => {
      const prev = snapshotAppliedFilters()
      mutator()
      const next = toRaw(appliedFilters) || {}
      return !isEqual(prev, next)
    }

    const goFirstPageOrRefresh = (changed: boolean) => {
      if (changed) {
        if (result.page?.value !== 1) {
          result.onUpdatePage?.(1)
        }
        return
      }
      result.onRefresh?.()
    }

    const handleFilterSearch = () => {
      const changed = mutateAppliedFilters(() => {
        Object.keys(appliedFilters).forEach((k) => {
          delete (appliedFilters as Record<string, unknown>)[k]
        })
        Object.assign(appliedFilters, cloneFilters(filters.value))
        Object.assign(appliedFilters, cloneFilters(reactiveFilters.value))
      })
      goFirstPageOrRefresh(changed)
    }

    const handleFilterReset = () => {
      const keepTab = (filters.value as Record<string, any>)?.tab
      Object.keys(filters.value || {}).forEach((k) => {
        if (k !== 'tab') {
          delete (filters.value as Record<string, unknown>)[k]
        }
      })
      const changed = mutateAppliedFilters(() => {
        Object.keys(appliedFilters).forEach((k) => {
          delete (appliedFilters as Record<string, unknown>)[k]
        })
        if (keepTab !== undefined) {
          (appliedFilters as Record<string, any>).tab = keepTab
        }
        Object.assign(appliedFilters, cloneFilters(reactiveFilters.value))
      })
      goFirstPageOrRefresh(changed)
      filterRenderKey.value++
    }

    const filterActionRowSchema = computed<JsonSchemaNode>(() => ({
      tag: 'div',
      attrs: {
        class: 'flex flex-wrap gap-2 items-center w-full',
      },
      children: [
        {
          tag: 'div',
          attrs: {
            class: 'text-right text-sm text-muted w-24 px-1',
          },
        },
        {
          tag: 'div',
          attrs: {
            class: 'flex flex-wrap gap-2 flex-1',
          },
          children: [
            {
              tag: NButton,
              attrs: {
                type: 'primary',
                secondary: true,
                onClick: handleFilterSearch,
              },
              slots: {
                icon: () => <div class="i-tabler:search size-4" />,
                default: () => t('components.button.search'),
              },
            },
            {
              tag: NButton,
              attrs: {
                secondary: true,
                onClick: handleFilterReset,
              },
              slots: {
                icon: () => <div class="i-tabler:arrow-back-up size-4" />,
                default: () => t('components.button.reset'),
              },
            },
            {
              tag: NButton,
              attrs: {
                secondary: true,
                onClick: () => result.onRefresh?.(),
              },
              slots: {
                icon: () => <div class="i-tabler:refresh size-4" />,
              },
            },
          ],
        },
      ],
    }) as JsonSchemaNode)

    const filterSchemaMulti = computed<JsonSchemaNode[]>(() => {
      if (!hasFilterSchema.value) {
        return []
      }
      const rows = filterRows.value.map((row) => {
        const isMultiColumn = row.nodes.length > 1
        return {
          tag: 'div',
          attrs: {
            'class': 'flex flex-wrap gap-2 w-full items-start',
            'data-filter-row': row.key,
          },
          children: row.nodes.map((node) => {
            const label = node.label
            return {
              tag: 'div',
              attrs: {
                class: isMultiColumn ? 'flex items-start gap-2' : 'flex items-start gap-2 w-full',
              },
              children: [
                label
                  ? {
                      tag: 'div',
                      attrs: {
                        class: 'w-24 text-right text-sm text-muted px-1 flex-none pt-1.5',
                      },
                      children: label,
                    }
                  : {
                      tag: 'div',
                      attrs: {
                        class: 'w-24 flex-none',
                      },
                    },
                {
                  tag: 'div',
                  attrs: {
                    class: 'min-w-50',
                  },
                  children: node.schema,
                },
              ],
            } as JsonSchemaNode
          }),
        } as JsonSchemaNode
      })
      rows.push(filterActionRowSchema.value)
      return rows
    })

    const { render: filterRenderMulti } = useJsonSchema({
      data: filterSchemaMulti,
    })

    const renderSideControls = () => {
      const showSideLeft = Boolean(slots?.sideLeft) && width.value < 1024
      const showSideRight = Boolean(slots?.sideRight) && width.value < 1024
      const showFilter = !slots?.filter && shouldShowFilter.value && width.value < 1024
      if (!showSideLeft && !showSideRight && !showFilter) {
        return null
      }
      return (
        <div
          class={[
            'flex gap-2',
          ]}
        >
          {showSideLeft && (
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

          {showSideRight && (
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

          {showFilter && (
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
          )}
        </div>
      )
    }

    const renderSearchControls = () => (
      <div
        class={[
          'flex gap-2 flex-row',
        ]}
      >
        <div class="flex lg:hidden">
          <NButton
            type="primary"
            secondary
            onClick={handleFilterSearch}
          >
            {{
              icon: () => <div class="i-tabler:search size-4" />,
            }}
          </NButton>
        </div>
        <div class={[
          'hidden lg:flex gap-2',
        ]}
        >
          <NButton
            type="primary"
            secondary
            onClick={handleFilterSearch}
          >
            {{
              icon: () => <div class="i-tabler:search size-4" />,
              default: () => t('components.button.search'),
            }}
          </NButton>
          <NButton
            secondary
            onClick={handleFilterReset}
          >
            {{
              icon: () => <div class="i-tabler:arrow-back-up size-4" />,
              default: () => t('components.button.reset'),
            }}
          </NButton>
          <NButton
            secondary
            onClick={() => result.onRefresh?.()}
          >
            {{
              icon: () => <div class="i-tabler:refresh size-4" />,
            }}
          </NButton>
        </div>
      </div>
    )

    const renderControlBar = (withSearch: boolean) => {
      const sideControls = renderSideControls()
      const searchControls = withSearch ? renderSearchControls() : null
      if (!sideControls && !searchControls) {
        return null
      }
      return (
        <div class="flex justify-between gap-2">
          {sideControls}
          {searchControls}
        </div>
      )
    }

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
      nextTick(() => {
        tabsInstRef.value?.syncBarPosition()
      })
    })

    const tab = useTabStore()

    const tabInfo = tab.tabs.find(v => v.path === tab.current)

    const activeTab = computed(() => {
      const values = props.tabs?.map(t => t.value) || []
      const current = filters.value?.tab
      return values.includes(current as any) ? current : values[0]
    })

    onMounted(() => {
      nextTick(() => {
        tabsInstRef.value?.syncBarPosition()
      })
    })

    watch(
      () => reactiveFilters.value,
      (val) => {
        const changed = mutateAppliedFilters(() => {
          const next = (val || {}) as Record<string, any>
          Object.keys(next).forEach((k) => {
            const v = next[k]
            if (v === undefined || v === null || v === '') {
              delete (appliedFilters as Record<string, unknown>)[k]
            }
            else {
              (appliedFilters as Record<string, any>)[k] = v
            }
          })
        })
        if (changed) {
          goFirstPageOrRefresh(true)
        }
      },
      { deep: true },
    )

    return () => (
      <DuxPage actions={props.actions} scrollbar={false}>
        {{
          sideLeft: () => slots?.sideLeft && width.value >= 1024 ? slots?.sideLeft?.() : undefined,
          sideRight: () => slots?.sideRight && width.value >= 1024 ? slots?.sideRight?.() : undefined,
          default: () => (
            <div
              class={[
                'flex flex-col h-full relative',
                shouldShowFilter.value && 'gap-3',
              ]}
            >
              <div
                class={[
                  'flex gap-2 justify-between flex-row',
                  shouldShowFilter.value && 'border-b border-muted',
                ]}
              >
                <div class="relative top-1.5px">
                  {!props.tabs && <div class="pb-4 pt-2 text-base">{tabInfo?.label}</div>}
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
                        ;(appliedFilters as any).tab = v
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

              {shouldShowFilter.value
                ? (
                    slots.filter
                      ? slots.filter({
                          filter: filters.value,
                          filterReactive: reactiveFilters.value,
                          onSearch: handleFilterSearch,
                          onReset: handleFilterReset,
                        })
                      : (
                          (props.filterType === 'multi' && width.value >= 1024)
                            ? (
                                <div class="flex flex-col gap-3">
                                  {(width.value >= 1024 || mobileFiltersShow.value) && (
                                    <div class="flex flex-col gap-3 w-full">
                                      <div key={filterRenderKey.value} class="flex flex-col gap-3">
                                        {h(filterRenderMulti)}
                                      </div>
                                    </div>
                                  )}

                                  {renderControlBar(false)}
                                </div>
                              )
                            : (
                                <div class="flex gap-2 justify-between flex-col-reverse lg:flex-row">
                                  {(width.value >= 1024 || mobileFiltersShow.value) && (
                                    <div
                                      class={[
                                        'flex-1 flex flex-col lg:flex-row gap-2 flex-wrap',
                                      ]}
                                    >
                                      <div key={filterRenderKey.value} class="contents">
                                        {h(filterRenderDefault)}
                                      </div>
                                    </div>
                                  )}

                                  {renderControlBar(true)}
                                </div>
                              )
                        )
                  )
                : renderSideControls()}

              {slots?.header?.()}
              <div class="flex-1 min-h-0">
                {slots?.default?.({
                  ...result,
                  width: tableWidth.value,
                })}
              </div>
              <div class="flex justify-between">
                <div class="flex items-center gap-0.5">
                  {slots?.bottom?.()}

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
                          <NButton quaternary circle icon-placement="right">
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
                          <NButton quaternary circle loading={isExporting.value} onClick={onExport}>
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
                          <NButton quaternary circle loading={isImporting.value} onClick={onImport}>
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
                          <NButton quaternary circle onClick={onAutoRefetch}>
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
