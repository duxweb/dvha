import type { DefaultError, UseMutationOptions } from '@tanstack/vue-query'
import type { IDataProviderCustomOptions, IDataProviderError, IDataProviderResponse } from '../types'
import { computed, ref } from 'vue'
import { useCustomMutation } from './data'

export interface IImportProgress {
  totalItems: number // 总条数
  processedItems: number // 处理条数
  totalBatches: number // 总批次
  processedBatches: number // 处理批次
  percentage: number // 百分比
}

export interface IUseImportProps extends IDataProviderCustomOptions {
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderCustomOptions>
  onComplete?: (progress: IImportProgress) => void
  onProgress?: (progress: IImportProgress) => void
  onError?: (error: IDataProviderError) => void
  interval?: number
  chunkSize?: number
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function useImport(props: IUseImportProps) {
  const isImporting = ref(false)

  const progress = ref<IImportProgress>({
    totalItems: 0,
    processedItems: 0,
    totalBatches: 0,
    processedBatches: 0,
    percentage: 0,
  })

  const params = computed(() => {
    const { onComplete, onProgress, onError, interval, chunkSize, ...rest } = props
    return rest
  })

  const { mutate: onImport } = useCustomMutation({
    path: props.path,
    method: 'POST',
    ...params.value,
    options: {
      ...params.value.options,
    },
  })

  const trigger = async (data: Record<string, any>[]) => {
    if (isImporting.value) {
      return
    }

    const chunkSize = props.chunkSize || 100
    const interval = props.interval || 100
    const totalItems = data.length
    const chunks: Record<string, any>[][] = []

    // 分批处理数据
    for (let i = 0; i < totalItems; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize))
    }

    const totalBatches = chunks.length

    // 初始化进度
    progress.value = {
      totalItems,
      processedItems: 0,
      totalBatches,
      processedBatches: 0,
      percentage: 0,
    }

    isImporting.value = true

    try {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]

        await onImport({
          payload: chunk,
        })

        progress.value.processedBatches = i + 1
        progress.value.processedItems += chunk.length
        progress.value.percentage = Math.round((progress.value.processedItems / totalItems) * 100)

        props.onProgress?.(progress.value)

        if (i < chunks.length - 1) {
          await sleep(interval)
        }
      }

      isImporting.value = false
      props.onComplete?.(progress.value)
    }
    catch (error) {
      isImporting.value = false
      props.onError?.(error as IDataProviderError)
    }
  }

  const loading = computed(() => isImporting.value)

  return {
    isLoading: loading,
    progress: computed(() => progress.value),
    trigger,
  }
}
