import type { DataTableBaseColumn, DataTableExpandColumn, DataTableFilterState, DataTableProps, DataTableRowKey, DataTableSortState, PaginationProps } from 'naive-ui'
import type { ComputedRef, Ref } from 'vue'
import { useList } from '@duxweb/dvha-core'
import { reactiveComputed } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { computed, ref, toRef, watch } from 'vue'

export interface TableColumnExtend {
  show?: boolean
  key?: TableColumnKey
}

export interface TablePagination {
  page: number
  pageSize: number
}

export type TableColumnKey = string | number

export type TableColumn = (DataTableBaseColumn | DataTableExpandColumn) & TableColumnExtend

export interface UseTableProps {
  path: string
  key?: TableColumnKey
  totalField?: string
  filters: Record<string, any>
  columns: TableColumn[]
  expanded?: boolean
  pagination?: boolean | TablePagination
}

export interface UseNaiveTableReturn {
  list: ComputedRef<Record<string, any>[]>
  meta: ComputedRef<Record<string, any> | undefined>
  tablePagination: ComputedRef<PaginationProps>
  tableProps: ComputedRef<DataTableProps>
  columns: Ref<TableColumn[]>
  isLoading: ComputedRef<boolean>
  columnSelected: ComputedRef<string[]>
  onUpdateColumnSelected: (v: string[]) => void
  onUpdateChecked: (v: DataTableRowKey[]) => void
  onUpdateExpanded: (v: DataTableRowKey[]) => void
  onUpdateSorter: (v: DataTableSortState | DataTableSortState[] | null) => void
  onUpdateFilter: (v: DataTableFilterState) => void
  refetch: () => void
  dataFilters: Record<string, any>
  dataSorters: Ref<Record<string, 'asc' | 'desc'>>
}

export function useNaiveTable(props: UseTableProps): UseNaiveTableReturn {
  const filters = toRef(props.filters)

  const pagination = toRef(typeof props.pagination === 'object'
    ? props.pagination
    : {
        page: 1,
        pageSize: 20,
      })

  const tableCheckeds = ref<DataTableRowKey[]>([])
  const tableSorters = ref<Record<string, 'asc' | 'desc'>>({})
  const tableFilters = ref<Record<string, any>>({})
  const tableExpanded = ref<DataTableRowKey[]>([])

  const dataFilters = reactiveComputed<Record<string, any>>(() => ({
    ...filters.value,
    ...tableFilters.value,
  }))

  const { data, isLoading, refetch } = useList({
    path: props.path,
    pagination: props.pagination ? pagination.value : false,
    filters: dataFilters,
    sorters: tableSorters.value,
  })

  const pageCount = computed(() => {
    return Math.ceil(data.value?.meta?.[props.totalField || 'total'] / pagination.value.pageSize) || 0
  })

  // 列处理
  const columns = ref<TableColumn[]>([])

  watch(() => props.columns, (v) => {
    columns.value = v
  }, {
    immediate: true,
  })

  const columnSelected = computed(() => {
    return columns.value.filter(item => item.show !== false && 'key' in item).map(item => (item as any).key as string)
  })

  const onUpdateColumnSelected = (v: string[]) => {
    const newColumns = cloneDeep(props.columns)?.map((item) => {
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
    tableCheckeds.value = keys
  }

  // 排序处理
  const onUpdateSorter = (v: DataTableSortState | DataTableSortState[] | null) => {
    const list = Array.isArray(v) ? v : [v]

    const newSorter = { ...tableSorters.value }
    list?.forEach((item) => {
      if (!item?.columnKey) {
        return
      }
      if (item.order) {
        newSorter[item.columnKey] = item.order === 'ascend' ? 'asc' : 'desc'
      }
      else {
        delete newSorter[item.columnKey]
      }
    })

    tableSorters.value = newSorter
  }

  // 筛选处理
  const onUpdateFilter = (v: DataTableFilterState) => {
    const newTablefilter = { ...tableFilters.value }

    Object.entries(v).forEach(([key, value]) => {
      newTablefilter[key] = value
    })

    tableFilters.value = newTablefilter
  }

  // 展开处理
  const onUpdateExpanded = (v: DataTableRowKey[]) => {
    tableExpanded.value = v
  }

  // 分页处理
  const onUpdatePageSize = (v) => {
    pagination.value.pageSize = v
    pagination.value.page = 1
  }

  const onUpdatePage = (v) => {
    pagination.value.page = v
  }

  // 分页计算
  const tablePagination = computed(() => {
    return {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      pageCount: pageCount.value,
      pageSizes: [10, 20, 30, 40, 50],
      pageSlot: 5,
      onUpdatePage,
      onUpdatePageSize,
      showSizePicker: true,
      showQuickJumper: true,
    }
  })

  // 表格属性
  const tableProps = computed<DataTableProps>(() => {
    return {
      remote: true,
      checkedRowKeys: tableCheckeds.value,
      expandedRowKeys: tableExpanded.value,
      onUpdateCheckedRowKeys: onUpdateChecked,
      onUpdateExpandedRowKeys: onUpdateExpanded,
      onUpdateSorter,
      onUpdateFilters: onUpdateFilter,
      loading: isLoading.value,
      data: data.value?.data || [],
      columns: columns.value.filter(item => item.show !== false),
    } as DataTableProps
  })

  const list = computed<Record<string, any>[]>(() => data.value?.data || [])
  const meta = computed<Record<string, any> | undefined>(() => data.value?.meta || {})

  return {
    list,
    meta,
    tablePagination,
    tableProps,
    columns,
    isLoading,
    columnSelected,

    onUpdateColumnSelected,
    onUpdateChecked,
    onUpdateExpanded,
    onUpdateSorter,
    onUpdateFilter,
    refetch,
    dataFilters,
    dataSorters: tableSorters,
  }
}
