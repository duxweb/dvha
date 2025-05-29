import type { InfiniteData } from '@tanstack/vue-query'
import type { IDataProviderResponse } from '../types'
import type { IInfiniteListParams } from './data'
import { computed, ref } from 'vue'
import { useInfiniteList } from './data'

interface IUseExportProps extends IInfiniteListParams {
  onSuccess?: (data: InfiniteData<IDataProviderResponse | undefined> | undefined) => void
  interval?: number
  maxPage?: number
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function useExport(props: IUseExportProps) {
  const isExporting = ref(false)

  const listProps = computed(() => {
    const { onSuccess, interval, maxPage, ...rest } = props
    return rest
  })

  const maxPage = computed(() => {
    return props.maxPage || 100
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

      await refetch()

      while (hasNextPage.value && pagination.value.page < maxPage.value) {
        if (interval.value > 0) {
          await sleep(interval.value)
        }

        await fetchNextPage()
      }
      props.onSuccess?.(data.value)
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
