import type { UseExtendListProps } from '@duxweb/dvha-core'
import type { DataTableBaseColumn, DataTableExpandColumn, DataTableFilterState, DataTableProps, DataTableRowKey, DataTableSelectionColumn, DataTableSortState, PaginationProps } from 'naive-ui'
import type { ComputedRef, MaybeRef, Ref } from 'vue'
import { treeToArr, useExtendList } from '@duxweb/dvha-core'
import { watchDebounced } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { computed, ref, toRef, unref, watch } from 'vue'

export interface TableColumnExtend {
  show?: boolean
  key?: TableColumnKey
}

export interface TablePagination {
  page: number
  pageSize: number
}

export type TableColumnKey = string | number

export type DataTableColumn = DataTableBaseColumn | DataTableExpandColumn | DataTableSelectionColumn
export type TableColumn = DataTableColumn & TableColumnExtend

export interface UseTableProps extends Omit<UseExtendListProps, 'key'> {
  key?: TableColumnKey
  columns: MaybeRef<TableColumn[]>
  expanded?: boolean
}

export interface UseNaiveTableReturn extends ReturnType<typeof useExtendList> {
  // 表格特有的属性
  tablePagination: ComputedRef<PaginationProps>
  table: ComputedRef<DataTableProps>
  columns: Ref<TableColumn[]>
  columnSelected: ComputedRef<string[]>
  onUpdateColumnSelected: (v: string[]) => void

}

export function useNaiveTable(props: UseTableProps): UseNaiveTableReturn {
  const filters = computed(() => unref(props.filters) || {})
  const sorters = computed(() => unref(props.sorters) || {})
  const tableColumns = toRef(props, 'columns', [])

  const tableFilters = ref<Record<string, any>>({})
  const tableExpanded = ref<DataTableRowKey[]>([])

  const dataFilters = ref<Record<string, any>>({
    ...filters.value,
    ...tableFilters.value,
  })
  const dataSorters = ref<Record<string, 'asc' | 'desc'>>({
    ...sorters.value,
  })
  // 使用 useExtendList
  const extendListResult = useExtendList({
    ...props,
    filters: dataFilters,
    sorters: dataSorters,
  })

  watchDebounced([filters, tableFilters], ([filtersValue, tableFiltersValue]) => {
    const mergedFilters = {
      ...(filtersValue || {}),
      ...(tableFiltersValue || {}),
    }
    dataFilters.value = mergedFilters
    extendListResult.onUpdateFilters(mergedFilters)
  }, {
    debounce: 300,
    deep: true,
  })

  // 列处理
  const columns = ref<TableColumn[]>([])

  watch(tableColumns, (v) => {
    columns.value = v as TableColumn[]
  }, {
    immediate: true,
  })

  const columnSelected = computed(() => {
    return columns.value.filter(item => item.show !== false && 'key' in item).map(item => (item as any).key as string)
  })

  const onUpdateColumnSelected = (v: string[]) => {
    const newColumns = cloneDeep(tableColumns.value)?.map((item) => {
      if (!('key' in item) || !item?.key || !('title' in item) || !item?.title) {
        return item
      }
      if (!v.includes((item as any).key as string)) {
        item.show = false
      }
      return item
    })

    columns.value = [...newColumns]
  }

  // 选中处理
  const onUpdateChecked = (keys: DataTableRowKey[]) => {
    extendListResult.checkeds.value = keys as any
  }

  // 排序处理
  const onUpdateSorter = (v: DataTableSortState | DataTableSortState[] | null) => {
    const list = Array.isArray(v) ? v : [v]

    const newSorter: Record<string, 'asc' | 'desc'> = {}
    list?.forEach((item) => {
      if (!item?.columnKey) {
        return
      }
      if (item.order) {
        newSorter[item.columnKey] = item.order === 'ascend' ? 'asc' : 'desc'
      }
    })

    dataSorters.value = newSorter
    extendListResult.onUpdateSorters(newSorter)
  }

  // 筛选处理
  const onUpdateFilter = (v: DataTableFilterState) => {
    const newTableFilter = { ...tableFilters.value }

    Object.entries(v).forEach(([key, value]) => {
      newTableFilter[key] = value
    })

    tableFilters.value = newTableFilter
  }

  // 展开处理
  const onUpdateExpanded = (v: DataTableRowKey[]) => {
    tableExpanded.value = v
  }

  watch([() => props?.expanded, extendListResult.list], ([expanded, list]) => {
    if (!expanded) {
      return
    }
    tableExpanded.value = treeToArr(list, props.key || 'id', 'children')
  })

  // 分页计算
  const tablePagination = computed(() => {
    return {
      page: extendListResult.page.value,
      pageSize: extendListResult.pageSize.value,
      pageCount: extendListResult.pageCount.value,
      pageSizes: extendListResult.pageSizes,
      pageSlot: 5,
      onUpdatePage: extendListResult.onUpdatePage,
      onUpdatePageSize: extendListResult.onUpdatePageSize,
      showSizePicker: true,
      showQuickJumper: true,
    }
  })

  // 表格属性
  const table = computed<DataTableProps>(() => {
    return {
      remote: true,
      checkedRowKeys: extendListResult.checkeds.value as DataTableRowKey[],
      expandedRowKeys: tableExpanded.value,
      onUpdateCheckedRowKeys: onUpdateChecked,
      onUpdateExpandedRowKeys: onUpdateExpanded,
      onUpdateSorter,
      onUpdateFilters: onUpdateFilter,
      loading: extendListResult.isLoading.value,
      data: extendListResult.list.value,
      columns: columns.value.filter(item => item.show !== false),
    } as DataTableProps
  })

  return {
    ...extendListResult,

    tablePagination,
    table,
    columns,
    columnSelected,
    onUpdateColumnSelected,

  }
}
