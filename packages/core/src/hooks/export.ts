import type { InfiniteData } from '@tanstack/vue-query'
import type { IDataProviderPagination, IDataProviderResponse } from '../types'
import type { IInfiniteListParams } from './data'
import { computed, ref } from 'vue'
import { useInfiniteList } from './data'

export interface IUseExportProps extends IInfiniteListParams {
  onSuccess?: (data: InfiniteData<IDataProviderResponse | undefined> | undefined) => void
  onProgress?: (data: IDataProviderPagination) => void
  interval?: number
  maxPage?: number | (() => number)
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function useExport(props: IUseExportProps) {
  const isExporting = ref(false)

  const listProps = computed(() => {
    const { onSuccess, onProgress, interval, maxPage, ...rest } = props
    return rest
  })

  const interval = computed(() => {
    return props.interval || 300
  })

  const { data, isLoading, fetchNextPage, hasNextPage, refetch, pagination } = useInfiniteList({
    ...listProps.value,
    options: {
      ...listProps.value.options,
      enabled: false,
    },
  })

  const trigger = async () => {
    if (isExporting.value) {
      return
    }

    try {
      isExporting.value = true
      pagination.value.page = 1

      props.onProgress?.(pagination.value)

      await refetch()

      const max = typeof props.maxPage === 'function' ? props.maxPage() : props.maxPage || 100

      while (hasNextPage.value && pagination.value.page < max) {
        if (interval.value > 0) {
          await sleep(interval.value)
        }

        await fetchNextPage()

        props.onProgress?.(pagination.value)
      }
      props.onSuccess?.(data.value as any)
    }
    finally {
      isExporting.value = false
    }
  }

  const loading = computed(() => isLoading.value || isExporting.value)

  return {
    data,
    isLoading: loading,
    trigger,
  }
}
