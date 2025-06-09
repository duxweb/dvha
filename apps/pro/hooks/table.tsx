import type { NotificationReactive } from 'naive-ui'
import type { MaybeRef } from 'vue'
import { useExportCsv, useImportCsv } from '@duxweb/dvha-core'
import { useCountdown } from '@vueuse/core'
import { NProgress, useMessage, useNotification } from 'naive-ui'
import { computed, ref } from 'vue'

interface UseTableProps {
  path: string
  totalField?: string
  filters?: Record<string, any>
  pageCount?: number
  meta?: MaybeRef<Record<string, any>>
  refetch?: () => void
}

export function useTableExtend(props: UseTableProps) {
  const autoRefetch = ref(false)
  const message = useMessage()
  const notification = useNotification()

  const nRef = ref<NotificationReactive | null>(null)

  const pagination = computed(() => {
    return {
      page: 1,
      pageSize: 50,
    }
  })

  const total = computed(() => {
    return props.meta?.[props.totalField || 'total'] || 0
  })

  const pageCount = computed(() => {
    return Math.ceil(total.value / pagination.value.pageSize) || 0
  })

  const { trigger: onExportTrigger, isLoading: isExporting } = useExportCsv({
    path: props.path,
    filters: props.filters,
    maxPage: () => {
      return pageCount.value
    },
    pagination: pagination.value,
    filename: 'data.csv',
    onSuccess: (data) => {
      nRef.value?.destroy()
      nRef.value = null
      const total = data?.pages?.reduce((acc, item) => acc + item?.data.length, 0) || 0
      notification.success({
        title: '导出数据成功',
        content: `成功导出 ${total} 条数据`,
        duration: 6000,
      })
    },
    onProgress: (v) => {
      if (!nRef.value) {
        nRef.value = notification.create({
          title: '导出数据中, 请稍后...',
          content: () => {
            return `${v.page || 1} / ${pageCount.value} 页数据`
          },
          avatar: () => {
            const percentage = Math.ceil((v.page || 1) / pageCount.value * 100)
            return (
              <NProgress class="size-10 text-sm" type="circle" percentage={percentage}>
                <div class="text-xs">
                  {percentage}
                </div>
              </NProgress>
            )
          },
          onClose: () => {
            nRef.value = null
          },
        })
      }
    },
    onError: (error) => {
      nRef.value?.destroy()
      nRef.value = null
      message.error(`导出数据失败：${error.message}`)
    },
  })

  const onExport = () => {
    onExportTrigger()
  }

  const { open: onImport, isLoading: isImporting } = useImportCsv({
    path: props.path,
    onComplete: (progress) => {
      nRef.value?.destroy()
      nRef.value = null
      notification.success({
        title: '导入数据成功',
        content: `成功导入 ${progress.processedItems} 条数据`,
        duration: 6000,
      })
    },
    onProgress: (v) => {
      if (!nRef.value) {
        nRef.value = notification.create({
          title: '导入数据中, 请稍后...',
          content: () => `${v.processedItems} / ${v.totalItems} 条数据`,
          avatar: () => (
            <NProgress class="size-10 text-sm" type="circle" percentage={v.percentage}>
              <div class="text-xs">
                {v.percentage}
              </div>
            </NProgress>
          ),
          onClose: () => {
            nRef.value = null
          },
        })
      }
    },
    onError: (error) => {
      nRef.value?.destroy()
      nRef.value = null
      message.error(`导入数据失败：${error.message}`)
    },
  })

  const { remaining, start, stop } = useCountdown(10, {
    onComplete: () => {
      props.refetch?.()
      start()
    },
  })

  const onRefresh = () => {
    autoRefetch.value = !autoRefetch.value
    if (autoRefetch.value) {
      start()
    }
    else {
      stop()
    }
  }

  return {
    isExporting,
    isImporting,
    onImport,
    onExport,

    autoRefetch,
    onRefresh,
    countdown: remaining,
  }
}
