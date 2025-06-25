import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PropType } from 'vue'
import type { UseActionItem } from '../../hooks'

export interface TablePagination {
  page: number
  pageSize: number
}
import { useExtendList, useI18n, useJsonSchema } from '@duxweb/dvha-core'
import { useWindowSize } from '@vueuse/core'
import { NButton, NCheckbox, NDrawer, NModal, NPagination, NProgress, NSpin, NTab, NTabs, NTooltip } from 'naive-ui'
import { computed, defineComponent, h, onMounted, reactive, ref, toRef, watch } from 'vue'
import { useAction } from '../../hooks'
import { DuxPage, DuxPageEmpty } from '../../pages'
import { DuxDrawerPage } from '../drawer'
import { DuxModalPage } from '../modal'
import { DuxFilterLayout, DuxTableFilter, DuxTableTools } from './'

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
  },
  setup(props, { slots }) {
    const filters = toRef(props.filter || {})
    const { t } = useI18n()
    const { renderAction } = useAction()

    const pagination = toRef(props.pagination && typeof props.pagination === 'object'
      ? props.pagination
      : {
          page: 1,
          pageSize: 20,
        })

    const tableFilter = ref<Record<string, any>>({})
    const handleFilter = () => {
      Object.assign(tableFilter.value, filters.value)
    }

    const result = useExtendList({
      path: props.path,
      filters: tableFilter.value,
      pagination: pagination.value,
    })

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

    // 筛选处理
    const filterOptions = reactive({
      show: false,
    })

    const sideLeft = reactive({
      show: false,
    })

    const sideRight = reactive({
      show: false,
    })

    const visibleFieldCount = ref(props.filterSchema?.length || 0)
    const { width: windowWidth } = useWindowSize()

    const calculateVisibleFields = () => {
      if (!props.filterSchema?.length)
        return 0

      const totalFields = props.filterSchema.length

      if (totalFields <= 3) {
        return totalFields
      }

      const screenWidth = windowWidth.value || 1024

      let maxFields = 3

      if (screenWidth >= 1280) {
        maxFields = 4
      }
      else if (screenWidth >= 1024) {
        maxFields = 3
      }
      else if (screenWidth >= 768) {
        maxFields = 2
      }
      else {
        maxFields = 1
      }

      return Math.min(totalFields, maxFields)
    }

    watch(windowWidth, () => {
      visibleFieldCount.value = calculateVisibleFields()
    })

    onMounted(() => {
      visibleFieldCount.value = calculateVisibleFields()
    })

    const primaryFilterSchema = computed(() => {
      return (props.filterSchema || []).slice(0, visibleFieldCount.value)
    })

    const advancedFilterSchema = computed(() => {
      return (props.filterSchema || []).slice(visibleFieldCount.value)
    })

    const showAdvancedFilter = computed(() => {
      return advancedFilterSchema.value.length > 0
    })

    const formatSchema = (schema: JsonSchemaNode[]) => {
      return schema.map((item) => {
        const { title, ...rest } = item
        return {
          tag: DuxTableFilter,
          attrs: {
            label: title,
            class: 'flex-1 min-w-0',
          },
          children: rest,
        }
      })
    }

    const { render: filterRenderPrimary } = useJsonSchema({
      data: computed(() => formatSchema(primaryFilterSchema.value)),
    })

    const { render: filterRenderAdvanced } = useJsonSchema({
      data: computed(() => formatSchema(advancedFilterSchema.value)),
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
      <DuxPage padding={false} scrollbar={false}>
        {{
          sideLeft: () => slots?.sideLeft && windowWidth.value >= 1024 ? slots?.sideLeft?.() : undefined,
          sideRight: () => slots?.sideRight && windowWidth.value >= 1024 ? slots?.sideRight?.() : undefined,
          default: () => (
            <div class="flex flex-col h-full relative">
              <div class="lg:justify-between gap-2 p-3">
                <div class="flex flex-col lg:flex-row lg:items-center gap-2">
                  {props.checkable && (
                    <div class="hidden lg:flex items-center pl-2">
                      <NTooltip>
                        {{
                          trigger: () => (
                            <div
                              class="flex items-center"
                            >
                              <NCheckbox
                                checked={result.isAllChecked.value}
                                indeterminate={result.isIndeterminate.value}
                                onUpdateChecked={result.toggleSelectAll}
                              >
                              </NCheckbox>
                            </div>
                          ),
                          default: () => t('components.list.selectAll'),
                        }}
                      </NTooltip>
                    </div>
                  )}
                  {props.tabs && (
                    <div>
                      <NTabs
                        type="segment"
                        size="small"
                        style={{
                          '--n-tab-padding': '4px 10px',
                        }}
                        default-value={props.tabs?.[0]?.value}
                        value={tableFilter.value?.tab}
                        onUpdateValue={(v) => {
                          tableFilter.value.tab = v
                        }}
                      >
                        {props.tabs?.map(tab => (
                          <NTab name={tab.value} tab={tab.label} />
                        ))}
                      </NTabs>
                    </div>
                  )}

                  <div class="flex gap-2">
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

                    <div
                      class="flex flex-wrap gap-2 items-center flex-1 lg:flex-none"
                    >
                      {h(filterRenderPrimary)}
                    </div>

                    <NButton type="primary" secondary onClick={handleFilter}>
                      {{
                        icon: () => <div class="i-tabler:search size-4" />,
                        default: () => t('components.button.search'),
                      }}
                    </NButton>

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

                    {showAdvancedFilter.value && (
                      <NButton
                        iconPlacement="right"
                        onClick={() => {
                          filterOptions.show = !filterOptions.show
                        }}
                      >
                        {{
                          default: () => t('components.button.advanced'),
                          icon: () => (
                            <div class={[
                              'i-tabler:chevrons-down size-4 transition-all',
                            ]}
                            />
                          ),
                        }}
                      </NButton>
                    )}
                  </div>
                </div>

                <div class="flex gap-2">
                  {slots.actions?.()}
                  {props.actions?.length > 0 && renderAction({
                    type: windowWidth.value < 1024 ? 'dropdown' : 'button',
                    text: windowWidth.value < 1024,
                    items: props.actions,
                  })}
                </div>

              </div>

              <NSpin show={isLoading.value} class="flex-1 min-h-0" contentClass="h-full">
                <div
                  class={[
                    'h-full overflow-auto rounded-lg px-3',
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

              <div class="flex justify-between px-3 py-2 gap-2">
                <div>

                  <div class="flex gap-1 items-center">

                    {props.checkable && (
                      <NTooltip>
                        {{
                          trigger: () => (
                            <NButton
                              loading={isImporting.value}
                              circle
                              quaternary
                            >
                              <NCheckbox
                                checked={result.isAllChecked.value}
                                indeterminate={result.isIndeterminate.value}
                                onUpdateChecked={result.toggleSelectAll}
                              >
                              </NCheckbox>
                            </NButton>
                          ),
                          default: () => t('components.list.selectAll'),
                        }}
                      </NTooltip>
                    )}

                    {slots?.tools?.()}

                    {tools.value.export && (
                      <NTooltip>
                        {{
                          trigger: () => (
                            <NButton loading={isExporting.value} onClick={onExport} circle quaternary>
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
                            <NButton loading={isImporting.value} onClick={onImport} circle quaternary>
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
                            <NButton onClick={onAutoRefetch} circle quaternary>
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
                <div class="flex items-center gap-2">
                  {slots?.bottom?.()}
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

              <NModal draggable class="bg-white rounded dark:shadow-gray-950/80  dark:bg-gray-800/60 backdrop-blur" show={filterOptions.show} onUpdateShow={v => filterOptions.show = v}>
                {{
                  default: ({ draggableClass }) => {
                    return (
                      <DuxModalPage title={t('components.button.filter')} handle={draggableClass} onClose={() => filterOptions.show = false}>
                        <DuxFilterLayout showLabel labelPlacement="top">
                          {h(filterRenderAdvanced)}
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
