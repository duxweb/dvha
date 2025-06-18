import type { UseTableProps } from '@duxweb/dvha-naiveui'
import type { NotificationReactive } from 'naive-ui'
import { useNaiveTable } from '@duxweb/dvha-naiveui'
import { NProgress, useMessage, useNotification } from 'naive-ui'
import { ref } from 'vue'

export function useTable(props: UseTableProps) {
  const message = useMessage()
  const notification = useNotification()
  const nRef = ref<NotificationReactive | null>(null)

  const result = useNaiveTable({
    ...props,
    // 传递导出回调
    onExportSuccess: (data) => {
      nRef.value?.destroy()
      nRef.value = null
      notification.success({
        title: '导出数据成功',
        content: `成功导出 ${data?.pages?.reduce((acc, item) => acc + item?.data.length, 0) || 0} 条数据`,
        duration: 6000,
      })
    },
    onExportProgress: (v) => {
      if (!nRef.value && v) {
        nRef.value = notification.create({
          title: '导出数据中, 请稍后...',
          content: () => `第 ${v.page || 1} 页数据`,
          avatar: () => (
            <NProgress class="size-10 text-sm" type="circle" percentage={50}>
              <div class="text-xs">
                {v.page || 1}
              </div>
            </NProgress>
          ),
          onClose: () => {
            nRef.value = null
          },
        })
      }
    },
    onExportError: (error) => {
      nRef.value?.destroy()
      nRef.value = null
      message.error(`导出数据失败：${error?.message || '未知错误'}`)
    },
    // 传递导入回调
    onImportSuccess: (progress) => {
      nRef.value?.destroy()
      nRef.value = null
      notification.success({
        title: '导入数据成功',
        content: `成功导入 ${progress?.processedItems || 0} 条数据`,
        duration: 6000,
      })
    },
    onImportProgress: (v) => {
      if (!nRef.value) {
        nRef.value = notification.create({
          title: '导入数据中, 请稍后...',
          content: () => `${v?.processedItems || 0} / ${v?.totalItems || 0} 条数据`,
          avatar: () => (
            <NProgress class="size-10 text-sm" type="circle" percentage={v?.percentage || 0}>
              <div class="text-xs">
                {v?.percentage || 0}
                %
              </div>
            </NProgress>
          ),
          onClose: () => {
            nRef.value = null
          },
        })
      }
    },
    onImportError: (error) => {
      nRef.value?.destroy()
      nRef.value = null
      message.error(`导入数据失败：${error?.message || '未知错误'}`)
    },
  })

  return result
}
