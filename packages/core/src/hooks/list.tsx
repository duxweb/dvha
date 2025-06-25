import type { IDataProviderError, IDataProviderPagination, IDataProviderResponse } from '../types'
import type { IImportProgress } from './import'
import { reactiveComputed, useCountdown } from '@vueuse/core'
import { computed, ref, toRef, watch } from 'vue'
import { useList } from './data'
import { useExportCsv } from './exportCsv'
import { useImportCsv } from './importCsv'

type IListKey = string | number

export interface IListPagination {
  page: number
  pageSize: number
}

export interface UseExtendListProps {
  path: string
  key?: IListKey
  totalField?: string
  filters?: Record<string, any>
  sorters?: Record<string, 'asc' | 'desc'>
  expanded?: boolean
  pagination?: boolean | IListPagination
  exportFilename?: string
  exportMaxPage?: number
  total?: (data?: IDataProviderResponse) => number
  onExportSuccess?: (data?: IDataProviderResponse) => void
  onExportProgress?: (data?: IDataProviderPagination) => void
  onExportError?: (error?: IDataProviderError) => void
  onImportSuccess?: (progress?: IImportProgress) => void
  onImportProgress?: (progress?: IImportProgress) => void
  onImportError?: (error?: IDataProviderError) => void
}

export function useExtendList(props: UseExtendListProps) {
  const filters = toRef(props, 'filters', {})
  const sorters = toRef(props, 'sorters', {})

  // 分页处理
  const pagination = toRef(typeof props.pagination === 'object'
    ? props.pagination
    : {
        page: 1,
        pageSize: 20,
      })

  const standardSizes = [10, 20, 30, 40, 50, 100]

  const generatePageSizes = (pageSize: number) => {
    return standardSizes.includes(pageSize)
      ? standardSizes
      : Array.from({ length: 5 }, (_, i) => pageSize * (i + 1))
  }

  const currentPageSizes = ref<number[]>(generatePageSizes(pagination.value.pageSize))

  watch(() => pagination.value.pageSize, (newPageSize) => {
    if (!currentPageSizes.value.includes(newPageSize)) {
      currentPageSizes.value = generatePageSizes(newPageSize)
    }
  })

  const onUpdatePageSize = (v) => {
    pagination.value.pageSize = v
    pagination.value.page = 1
  }

  const onUpdatePage = (v) => {
    pagination.value.page = v
  }

  // 数据处理
  const { data, isLoading, refetch } = useList({
    path: props.path,
    pagination: props.pagination ? pagination.value : false,
    filters: filters.value,
    sorters: sorters.value,
  })

  const list = computed<Record<string, any>[]>(() => data.value?.data || [])
  const meta = computed<Record<string, any> | undefined>(() => data.value?.meta || {})

  const total = computed(() => {
    return props.total?.(data.value) || meta.value?.[props.totalField || 'total'] || 0
  })

  const pageCount = computed(() => Math.ceil(total.value / pagination.value.pageSize) || 0)

  const onUpdateFilters = (v: Record<string, any>) => {
    filters.value = v
  }

  const onUpdateSorters = (v: Record<string, 'asc' | 'desc'>) => {
    sorters.value = v
  }

  // 选中处理
  const checkeds = ref<IListKey[]>([])

  const isAllChecked = computed(() => {
    return checkeds.value.length > 0 && checkeds.value.length === data.value?.data?.length
  })

  const isIndeterminate = computed(() => {
    return checkeds.value.length > 0 && checkeds.value.length < (data.value?.data?.length || 0)
  })

  const toggleChecked = (id: string | number) => {
    const index = checkeds.value.indexOf(id)
    if (index > -1) {
      checkeds.value.splice(index, 1)
    }
    else {
      checkeds.value.push(id)
    }
  }

  const onUpdateChecked = (v: IListKey[]) => {
    checkeds.value = v
  }

  const isChecked = (id: string | number) => {
    return checkeds.value.includes(id)
  }

  const toggleSelectAll = () => {
    if (isAllChecked.value) {
      checkeds.value = []
    }
    else {
      checkeds.value = data.value?.data?.map(item => item[props.key || 'id']).filter(id => id != null) || []
    }
  }

  watch(() => data.value?.data, () => {
    checkeds.value = []
  })

  // 刷新处理
  const onRefresh = () => {
    checkeds.value = []
    refetch()
  }

  // 导出处理
  const exportPagination = ref({
    page: 1,
    pageSize: 100,
  })

  const { trigger: onExport, isLoading: isExporting } = useExportCsv({
    path: props.path,
    filters: filters.value || {},
    sorters: sorters.value || {},
    maxPage: () => {
      return props.exportMaxPage || 0
    },
    pagination: exportPagination.value,
    filename: props.exportFilename || 'data.csv',
    onSuccess: (data) => {
      props.onExportSuccess?.(data)
      exportPagination.value.page = 1
    },
    onProgress: (v) => {
      props.onExportProgress?.(v)
    },
    onError: (error) => {
      props.onExportError?.(error)
      exportPagination.value.page = 1
    },
  })

  // 导出指定数据
  const exportFilter = reactiveComputed(() => {
    return {
      ids: checkeds.value,
    }
  })

  const { trigger: onExportRows, isLoading: isExportingRows } = useExportCsv({
    path: props.path,
    filters: exportFilter,
    maxPage: 1,
    filename: props.exportFilename || 'rows.csv',
    onSuccess: (data) => {
      props.onExportSuccess?.(data)
    },
    onError: (error) => {
      props.onExportError?.(error)
    },
  })

  // 导入处理
  const { open: onImport, isLoading: isImporting } = useImportCsv({
    path: props.path,
    onComplete: (progress) => {
      props.onImportSuccess?.(progress)
    },
    onProgress: (v) => {
      props.onImportProgress?.(v)
    },
    onError: (error) => {
      props.onImportError?.(error)
    },
  })

  // 自动刷新处理
  const autoRefetch = ref(false)
  const { remaining, start, stop } = useCountdown(10, {
    onComplete: () => {
      onRefresh()
      start()
    },
  })

  const onAutoRefetch = () => {
    autoRefetch.value = !autoRefetch.value
    if (autoRefetch.value) {
      onRefresh()
      start()
    }
    else {
      stop()
    }
  }

  return {
    // 数据
    list,
    meta,
    isLoading,
    pagination,
    filters,
    sorters,
    onRefresh,
    onUpdateFilters,
    onUpdateSorters,

    // 选中
    checkeds,
    isAllChecked,
    isIndeterminate,
    toggleChecked,
    isChecked,
    toggleSelectAll,
    onUpdateChecked,

    // 分页
    total,
    page: computed(() => pagination.value.page),
    pageSize: computed(() => pagination.value.pageSize),
    pageSizes: currentPageSizes.value,
    pageCount,
    onUpdatePage,
    onUpdatePageSize,

    // 导出
    onExport,
    isExporting,
    onExportRows,
    isExportingRows,

    // 导入
    onImport,
    isImporting,

    // 自动刷新
    autoRefetch,
    onAutoRefetch,
    autoCountdown: remaining,
  }
}
