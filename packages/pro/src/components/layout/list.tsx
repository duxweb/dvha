import type { JsonSchemaNode, UseExtendListProps } from '@duxweb/dvha-core'
import type { TabsInst } from 'naive-ui'
import type { PropType } from 'vue'
import type { UseActionItem } from '../../hooks'
import type { DuxToolOptionItem } from './'
import { useExtendList, useI18n, useJsonSchema } from '@duxweb/dvha-core'
import { useWindowSize } from '@vueuse/core'
import { NButton, NCheckbox, NDrawer, NPagination, NProgress, NSpin, NTab, NTabs, NTooltip } from 'naive-ui'
import { computed, defineComponent, h, nextTick, onMounted, reactive, ref, toRef, watch } from 'vue'
import { useAction } from '../../hooks'
import { DuxPage, DuxPageEmpty } from '../../pages'
import { DuxDrawerPage } from '../drawer'
// import { DuxModalPage } from '../modal'
import { DuxTableFilter, DuxTableTools } from './'

export interface TablePagination {
  page: number
  pageSize: number
}

export interface ListPageTools {
  import?: boolean
  export?: boolean
  refresh?: boolean
}

export const DuxListLayout = defineComponent({
  name: 'DuxListLayout',
  props: {
    rowKey: {
      type: String,
      default: 'id',
    },
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
    tools: {
      type: Object as PropType<ListPageTools>,
    },
    actions: {
      type: Array as PropType<UseActionItem[]>,
      default: () => [],
    },
    checkable: {
      type: Boolean,
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
    hookListProps: {
      type: Object as PropType<UseExtendListProps>,
    },
  },
  setup(props, { slots, expose }) {
    const filters = toRef(props, 'filter', {})
    const { t } = useI18n()
    const { renderAction } = useAction()

    const pagination = toRef(props.pagination && typeof props.pagination === 'object'
      ? props.pagination
      : {
          page: 1,
          pageSize: 20,
        })

    // 已生效筛选（仅点击查询/重置时更新；tab 仍即时同步）
    const appliedFilters = reactive<Record<string, unknown>>({
      ...(filters.value || {}),
    })

    const result = useExtendList({
      path: props.path,
      filters: appliedFilters,
      pagination: pagination.value,
      ...props.hookListProps,
    })

    expose(result)

    const { meta, list, isLoading, autoRefetch, autoCountdown, onAutoRefetch, isExporting, isExportingRows, isImporting, onExport, onExportRows, onImport } = result

    // 分页处理
    const paginationProps = computed(() => {
      return {
        page: result.page.value,
        pageSize: result.pageSize.value,
        pageCount: result.pageCount.value,
        pageSizes: result.pageSizes,
        pageSlot: 5,
        onUpdatePage: result.onUpdatePage,
        onUpdatePageSize: result.onUpdatePageSize,
        showSizePicker: true,
        showQuickJumper: true,
      }
    })

    // 筛选处理（不再使用折叠与弹窗，内联展示全部筛选项）

    const sideLeft = reactive({
      show: false,
    })

    const sideRight = reactive({
      show: false,
    })

    const { width: windowWidth } = useWindowSize()

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

    const filterRenderKey = ref<number>(0)

    const tools = computed(() => {
      return {
        import: false,
        export: true,
        refresh: true,
        ...props.tools,
      }
    })

    const tabsInstRef = ref<TabsInst | null>(null)

    const activeTab = computed(() => {
      const values = props.tabs?.map(t => t.value) || []
      const current = filters.value?.tab
      return values.includes(current as any) ? current : values[0]
    })

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

    watch(() => windowWidth.value, () => {
      nextTick(() => tabsInstRef.value?.syncBarPosition())
    })

    onMounted(() => {
      nextTick(() => tabsInstRef.value?.syncBarPosition())
    })

    // 移动端筛选显隐
    const mobileFiltersShow = ref(false)

    return () => (
      <DuxPage actions={props.actions} scrollbar={false}>
        {{
          sideLeft: () => slots?.sideLeft && windowWidth.value >= 1024 ? slots?.sideLeft?.() : undefined,
          sideRight: () => slots?.sideRight && windowWidth.value >= 1024 ? slots?.sideRight?.() : undefined,
          default: () => (
            <div class="flex flex-col gap-3 h-full relative">
              <div class="flex gap-2 justify-between flex-row border-b border-muted">
                <div class="relative top-1.5px">
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
                <div class="flex gap-2 justify-end">
                  {slots.actions?.()}
                  {props.actions?.length > 0 && renderAction({
                    type: windowWidth.value < 1024 ? 'dropdown' : 'button',
                    text: windowWidth.value < 1024,
                    items: props.actions,
                  })}
                </div>
              </div>

              <div class="flex gap-2 justify-between flex-col-reverse lg:flex-row items-center">
                {(windowWidth.value >= 1024 || mobileFiltersShow.value) && (
                  <div class={['flex-1 flex flex-col lg:flex-row gap-2 flex-wrap']}>
                    <div key={filterRenderKey.value} class="contents">
                      {h(filterRenderCollapse)}
                    </div>
                  </div>
                )}

                <div class="flex justify-between gap-2">
                  <div class={['flex-1 flex gap-2']}>
                    {slots?.sideLeft && windowWidth.value < 1024 && (
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
                    {slots?.sideRight && windowWidth.value < 1024 && (
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

                  <div class={['flex gap-2 items-center', 'flex-row']}>
                    <div class="flex lg:hidden">
                      <NButton
                        type="primary"
                        secondary
                        onClick={() => {
                          Object.keys(appliedFilters).forEach(k => delete (appliedFilters as Record<string, unknown>)[k])
                          Object.assign(appliedFilters, JSON.parse(JSON.stringify(filters.value || {})))
                          result.onUpdatePage?.(1)
                        }}
                      >
                        {{
                          icon: () => <div class="i-tabler:search size-4" />,
                        }}
                      </NButton>
                    </div>
                    <div class={['hidden lg:flex gap-2']}>
                      <NButton
                        type="primary"
                        secondary
                        onClick={() => {
                          Object.keys(appliedFilters).forEach(k => delete (appliedFilters as Record<string, unknown>)[k])
                          Object.assign(appliedFilters, JSON.parse(JSON.stringify(filters.value || {})))
                          result.onUpdatePage?.(1)
                        }}
                      >
                        {{
                          icon: () => <div class="i-tabler:search size-4" />,
                          default: () => t('components.button.search'),
                        }}
                      </NButton>
                      <NButton
                        secondary
                        onClick={() => {
                          const keepTab = (filters.value as Record<string, any>).tab
                          Object.keys(filters.value || {}).forEach((k) => {
                            if (k !== 'tab') {
                              delete (filters.value as Record<string, unknown>)[k]
                            }
                          })
                          Object.keys(appliedFilters).forEach((k) => {
                            delete (appliedFilters as Record<string, unknown>)[k]
                          })
                          if (keepTab !== undefined) {
                            (appliedFilters as Record<string, any>).tab = keepTab
                          }
                          result.onUpdatePage?.(1)
                          filterRenderKey.value++
                        }}
                      >
                        {{
                          icon: () => <div class="i-tabler:arrow-back-up size-4" />,
                          default: () => t('components.button.reset'),
                        }}
                      </NButton>
                    </div>
                  </div>

                </div>
              </div>

              <NSpin show={isLoading.value} class="flex-1 min-h-0" contentClass="h-full">
                <div
                  class={[
                    'h-full overflow-auto',
                  ]}
                >
                  {!isLoading.value && list.value.length === 0 && (
                    <div class="flex justify-center items-center h-full">
                      <DuxPageEmpty />
                    </div>
                  )}
                  {list.value.length > 0 && slots?.default?.(result)}
                </div>
              </NSpin>

              <div class="flex justify-between">
                <div class="flex items-center gap-0.5">
                  {props.checkable && (
                    <NTooltip>
                      {{
                        trigger: () => (
                          <NButton circle quaternary>
                            <NCheckbox
                              checked={result.isAllChecked.value}
                              indeterminate={result.isIndeterminate.value}
                              onUpdateChecked={result.toggleSelectAll}
                            />
                          </NButton>
                        ),
                        default: () => t('components.list.selectAll'),
                      }}
                    </NTooltip>
                  )}
                  {slots?.bottom?.()}
                  {slots?.tools?.()}

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
                <div class="flex items-center gap-2">
                  {props.pagination && (
                    <NPagination
                      {...paginationProps.value}
                      simple={windowWidth.value < 768}
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
                isLoading={result.isBatching.value}
                onBatch={result.onBatch}
                selecteds={result.checkeds.value}
                number={result.checkeds.value.length}
                group={[
                  [
                    {
                      icon: 'i-tabler:x',
                      onClick: () => {
                        result.checkeds.value = []
                        result.onUpdateChecked?.([])
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
